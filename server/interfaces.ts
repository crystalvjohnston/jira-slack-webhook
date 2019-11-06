export interface JiraObject {
    eventType: string;
    issue: any;
    changeLog:ChangeLog;
    user: User;
    jiraURL: string;
}

export interface User {
    self: string;
    name: string;
    key: string;
    emailAddress: string;
    avatarUrls: avatarURLs;
    displayName: string;
    active: boolean;
    timeZone: string;
}

export interface avatarURLs{ 
    [key: string]: string; 
}

export interface ChangeLog {
    id: string;
    items: Items[];
}

export interface Items {
    field: string;
    fieldtype: string;
    from: string | null;
    fromString: string| null;
    to: string| null;
    toString: string| null;
}