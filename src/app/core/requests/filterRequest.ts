import { FilterConnectorEnum, FilterOperatorEnum } from "@core/enums";
import { FilterDescriptor } from "./filterDescriptor";

export class FilterRequest {

    filterDescriptors: Array<FilterDescriptor> = [];
    pageSize: number = 0;
    skip: number = 0;

    /**
     * Add filters to request
     * @param propertyName property name (column name)
     * @param filterOperator contains, endsWith, equals, greaterThan ...
     * @param filterConnector AND, OR
     * @param value value to be filtered
     */
    addFilter(propertyName: string, filterOperator: string, filterConnector: string , value: any, alias: string = '') {
        this.filterDescriptors.push({
            propertyName: propertyName,
            filterOperator: this.convertFilterOperatorEnum(filterOperator),
            filterConnector: this.convertFilterConnectorEnum(filterConnector),
            value: value,
            aliasName: alias
        });
    }

    private convertFilterOperatorEnum(matchMode: string): FilterOperatorEnum {
        const mapping: { [key: string]: FilterOperatorEnum } = {
          contains: FilterOperatorEnum.contains,
          endsWith: FilterOperatorEnum.endsWith,
          equals: FilterOperatorEnum.equals,
          greaterThan: FilterOperatorEnum.greaterThan,
          greaterThanOrEquals: FilterOperatorEnum.greaterThanOrEquals,
          lessThan: FilterOperatorEnum.lessThan,
          lessThanOrEquals: FilterOperatorEnum.lessThanOrEquals,
          notContains: FilterOperatorEnum.notContains,
          notEquals: FilterOperatorEnum.notEquals,
          startsWith: FilterOperatorEnum.startsWith,
        };

        return mapping[matchMode];
      }

      private convertFilterConnectorEnum(operator: string) : FilterConnectorEnum {
        const mapping: { [key: string]: FilterConnectorEnum } = {
            and: FilterConnectorEnum.AND,
            or: FilterConnectorEnum.OR
        }

        return mapping[operator]
      }
}
