import { FilterConnectorEnum, FilterOperatorEnum } from "@core/enums";

export  class FilterDescriptor {
    propertyName: string = "";
    filterOperator: FilterOperatorEnum = FilterOperatorEnum.contains;
    filterConnector: FilterConnectorEnum = FilterConnectorEnum.AND;
    value: any;
    aliasName: string = "";
}
