
import fs from 'fs';
import path from 'path';

const jsonPath = path.join(process.cwd(), "data", "peoplefy", "people.json");

export const getPeople = () => {
    try {
        const jsonData = fs.readFileSync(jsonPath, 'utf-8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error("Error reading JSON file:", error);
        return [];
    }
};

export const savePerson = (newPerson: any) => {
    const people = getPeople();
    people.push(newPerson);
    fs.writeFileSync(jsonPath, JSON.stringify(people, null, 2));
};