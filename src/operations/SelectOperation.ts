import Operation from "./Operation";

export default class SelectOperation extends Operation {

    name() {
        return "select";
    }

    processInObject(keyword: string, source: any, target?: any) {
        const keywordValue: SelectKeywordValue = source[keyword];

        let value;

        // Determine the select context
        let selectContext = this._processor.currentScope.root.source;

        if (typeof keywordValue === "string") {
            value = this._processor.resolveJsonPointer(selectContext, keywordValue);
        } else {
            if (keywordValue.from !== undefined) {
                selectContext = this._processor.processSourceProperty(keywordValue.from, "from");
            }

            // Select based on JSON pointer or JSON path
            if (typeof keywordValue.path === "string") {
                value = this._processor.resolveJsonPointer(selectContext, keywordValue.path);
            } else if (typeof keywordValue.query === "string") {
                value = this._processor.resolveJsonPath(selectContext, keywordValue.query);
                if (keywordValue.multiple !== true) {
                    value = value[0];
                }
            }
        }

        // Merge with the target
        return this._processor.processSource(value, target);
    }
}

/*
 * TYPES
 */

export type SelectKeywordValue = string // json pointer
    | {
    "from"?: any; // select context
    "multiple"?: boolean; // expect multiple results?
    "path"?: string; // json pointer
    "query"?: string; // json path
};

