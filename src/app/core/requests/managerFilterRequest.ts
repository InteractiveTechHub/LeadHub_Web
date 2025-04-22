
export class ManagerFilterRequest {
  public isLeadCreatedAtDesc = true;
  public isLeadCreatedAtAsc = false;
  public isInteractionDesc = false;
  public isInteractionAsc = false;
  globalFilter: string = "";

  clearSortFilter() {
    this.isLeadCreatedAtDesc = false;
    this.isLeadCreatedAtAsc = false;
    this.isInteractionDesc = false;
    this.isInteractionAsc = false;
  }

  resetFilters() {
    this.isLeadCreatedAtDesc = true;
    this.isLeadCreatedAtAsc = false;
    this.isInteractionDesc = false;
    this.isInteractionAsc = false;

    this.globalFilter = "";
  }
}
