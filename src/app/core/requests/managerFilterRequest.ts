
export class ManagerFilterRequest {
  public isLeadCreatedAtDesc = true;
  public isLeadCreatedAtAsc = false;
  public isInteractionDesc = false;
  public isInteractionAsc = false;
  //filterContext?: string;

  clearSortFilter() {
    this.isLeadCreatedAtDesc = false;
    this.isLeadCreatedAtAsc = false;
    this.isInteractionDesc = false;
    this.isInteractionAsc = false;
  }
}
