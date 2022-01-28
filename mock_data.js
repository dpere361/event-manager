
let events = [];

let i;
let j;

for(i = 0; i < 20; ++i){
    events.push({
        name: `Event ${i+1}`,
        description: "This is an event",
        date: {
            start: new Date,
            end: new Date
        }, //should include time
        entries: [],
        entriesMax: 32
    })
    for(j=0;j<20;++j){
        events[i].entries.push({
            entryName: `Entry${j+1}`,
            entryId: 300 + j + i,
            approved: false,
            confirmed: false,
        })
    }
}

export {events};


