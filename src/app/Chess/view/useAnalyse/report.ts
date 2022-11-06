interface Description {
  checkIn?: number;
}

export enum REPORT_TYPE {
  check = "check",
  checkMate = "checkMate",
  undefined = "undefined",
  forbidden = "forbidden",
  opponentWillMate = "opponentWillMate"
}

export class Report {
  description: Description = {};
  type: REPORT_TYPE = REPORT_TYPE.undefined;

  public toString() {
    return `${this.type} ${JSON.stringify(this.description)}`;
  }

  public setType(type: REPORT_TYPE, description?: Description) {
    this.type = type;
    if (description) this.description = description;
  }

  public postAnalysed() {
    return this.type === REPORT_TYPE.check || this.type === REPORT_TYPE.checkMate;
  }

  public is(type: REPORT_TYPE) {
    return this.type === type;
  }

  // if report is better than current return 1 otherwise -1
  public compare(report: Report) {
    if (report.is(REPORT_TYPE.checkMate) && this.is(REPORT_TYPE.checkMate)) {
      return this.description.checkIn! - report.description.checkIn!;
    }

    if (report.is(REPORT_TYPE.checkMate) && !this.is(REPORT_TYPE.checkMate)) return 1;

    if (!report.is(REPORT_TYPE.checkMate) && this.is(REPORT_TYPE.checkMate)) return -1;

    if (report.is(REPORT_TYPE.check) && !this.is(REPORT_TYPE.check)) return 1;

    if (!report.is(REPORT_TYPE.check) && this.is(REPORT_TYPE.check)) return -1;

    return 0;
  }
}
