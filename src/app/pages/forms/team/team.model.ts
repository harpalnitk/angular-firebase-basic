export interface Team {
    name: string;
    members: Developer[];
}

export interface Developer{
    id: string;
    firstName: string;
    lastName: string;
    favColor: string;
    favFood: string;
    expertiseLevel: 'Entry-Level' | 'Mid-Level' | 'Expert-Level'
}