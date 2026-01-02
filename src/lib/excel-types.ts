// Types matching the Excel sheet structure exactly
export interface ExcelDoctrine {
    DoctrineID: string;
    Category: string;
    Term: string;
    PlainDefinition: string;
    TechnicalDefinition: string;
    KeyDocs: string;
    Notes: string;
    SourceIDs: string;
}

export interface ExcelPosition {
    DoctrineID: string;
    DoctrineTerm: string;
    TraditionID: string;
    Tradition: string;
    Stance: string; // "Affirm", "Deny", "Qualified"
    Summary: string;
    KeySources: string; // Semicolon separated
    Confidence: string;
}

export interface ExcelSource {
    SourceID: string;
    Type: string;
    Title: string;
    AuthorBody: string;
    Year: string;
    Tradition: string;
    URL: string;
    Notes: string;
}
