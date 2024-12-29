const express = require('express');
const app = express();
const port = 3000;
const masterKey = "4VGP2DN-6EWM4SJ-N6FGRHV-Z3PR3TT";

const participants = 
    {
        1: ['1-2', '1','1-4', '1-10','1-6'],
        2: ['1-2','1-4', '1-10','1-6','2-6', '2+', '2-10'],
        3: ['1-4', '1-10','1-6','2-6', '2+', '2-10'],
        4: ['1-4', '1-10','1-6','2-6', '2+', '2-10'],
        5: ['1-10','1-6','2-6', '2+', '2-10'],
        6: ['1-10','1-6','2-6', '2+', '2-10'],
        7: ['1-10', '2+', '2-10'],
};
var categories = ['Creative','Wellness','Cooking','Educational','Outdoor','Fitness','Community','Entertainment','Productive'];

app.use(express.urlencoded({ extended: true }));

function participantscure(num,res){
  const validParticipants = participants[num];
  const findcure = cure.filter(cures => validParticipants.includes(cures.participants));
  return findcure;
}

//1. GET a random cure
app.get("/random",(req,res)=>{
  const rand = Math.floor(Math.random()*cure.length);
  res.json(cure[rand]);
});

//2. GET a cure by filtering on the cure type
app.get("/cures/filter", (req, res) => {
  var type = req.query.type;
  var persons = parseInt(req.query.participants);
  type = type.toLowerCase();
  type = type.charAt(0).toUpperCase() + type.slice(1);
  if(type && !categories.includes(type)){
      return res.status(404).json({ message: `No cures found for type: ${type}` });
  }

  let findcure = cure;

  if(type){
    findcure = findcure.filter(cures => cures.type === type);
  }
  if(persons){
      const validParticipants = persons > 6 ? participantscure(7) : participantscure(persons);
      findcure = findcure.filter(cures => validParticipants.includes(cures));
  }

  if(findcure.length === 0){    
      return res.status(404).json({ message: "No cures found for the given filters." });
  }

  res.json(findcure[Math.floor(Math.random() * findcure.length)]); 
});

//3. GET a specific cure
app.get("/cures/:key",(req,res)=>{
  const key = req.params.key; 
  if(req.params.key > cure.length){
    return res.status(400).send(`cure number ${key} does not exit`);
  }
  const findcure = cure.find(cures => cures.key === key);
  res.json(findcure);
});

//4. Create a new cure
app.post("/cures/create", (req,res) => {
  var key = (cure.length+1).toString();
  if(cure.some(item => item.activity === req.body.activity)){
    res.status(400).json("This cure is already added!");
  }else{
    const newcure = {
        "activity": req.body.activity,
        "key": key,
        "participants": req.body.participants,
        "type": req.body.type,
        "link": req.body.link,
        "difficulty": req.body.difficulty,
        "duration": req.body.duration,
    };
    cure.push(newcure);
    res.send(newcure);
  }

});

//5. Update a cure entirely
app.put("/cures/:key", (req,res) => {
  var key = parseInt(req.params.key); 
  cure[key].activity = req.body.activity;
  cure[key].type = req.body.type;
  cure[key].participants = req.body.participants;
  cure[key].link = req.body.link;
  cure[key].difficulty = req.body.difficulty;
  cure[key].duration = req.body.duration;
  res.send({
    message: `Updated cure with key ${key} successfully.`,
    updatedcure: cure[key],
  });

});

//6. Update an attribute of the cure
app.patch("/cures/:key", (req, res) => {
    const key = (parseInt(req.params.key)-1);
    if (!cure[key]) {
      return res.status(400).send(`Cure with key ${key+1} does not exist.`);
    }
    const updatedCure = cure[key];
  
    if (req.body.activity) {
      updatedCure.activity = req.body.activity;
    }
    if (req.body.participants) {
      updatedCure.participants = req.body.participants;
    }
    if (req.body.type) {
      updatedCure.type = req.body.type;
    }
    if (req.body.link) {
      updatedCure.link = req.body.link;
    }
    if (req.body.difficulty) {
      updatedCure.difficulty = req.body.difficulty;
    }
    if (req.body.duration) {
      updatedCure.duration = req.body.duration;
    }

    res.send({
      message: `Updated cure with key ${key+1} successfully.`,
      updatedCure: updatedCure,
    });
  });
  

//7. DELETE Specific cure
app.delete("/cures/:key", (req, res) => {
    const key = (parseInt(req.params.key)-1);
    if (!cure[key]) {
      return res.status(400).send({ error: `Cure with key ${key+1} does not exist.` });
    }
    const deletedCure = cure.splice(key, 1)[0];
    res.send({
      message: `Deleted cure with key ${key+1} successfully!`,
      cure: deletedCure,
    });
});
  

//8. DELETE All cures
app.delete("/cures/deleteall",(req,res)=>{
  if(req.query.key === masterKey){
    cure = [];
    res.send("All cures have been deleted successfully");
  }
});
app.listen(port, () => {
  console.log(`Successfully started server on port ${port}.`);
});



const cure = [
    {"activity": "Create a DIY craft project", "key": "1", "participants": "1-2", "type": "Creative", "link": "", "difficulty": "Medium", "duration": "2-3 hours"},
    {"activity": "Practice mindfulness meditation", "key": "2", "participants": "1", "type": "Wellness", "link": "", "difficulty": "Easy", "duration": "10-20 minutes"},
    {"activity": "Try a new recipe", "key": "3", "participants": "1-4", "type": "Cooking", "link": "", "difficulty": "Medium", "duration": "1-2 hours"},
    {"activity": "Take an online photography class", "key": "4", "participants": "1", "type": "Educational", "link": "", "difficulty": "Medium", "duration": "1-3 hours"},
    {"activity": "Start a vegetable garden", "key": "5", "participants": "1-2", "type": "Outdoor", "link": "", "difficulty": "Hard", "duration": "Ongoing"},
    {"activity": "Take a yoga class", "key": "6", "participants": "1-10", "type": "Fitness", "link": "", "difficulty": "Medium", "duration": "30-60 minutes"},
    {"activity": "Volunteer at a local animal shelter", "key": "7", "participants": "1-4", "type": "Community", "link": "", "difficulty": "Medium", "duration": "2-4 hours"},
    {"activity": "Try a new board game", "key": "8", "participants": "2-6", "type": "Entertainment", "link": "", "difficulty": "Easy", "duration": "1-2 hours"},
    {"activity": "Plan a virtual cooking class with friends", "key": "9", "participants": "2+", "type": "Cooking", "link": "", "difficulty": "Medium", "duration": "1-2 hours"},
    {"activity": "Write a letter to a friend", "key": "10", "participants": "1", "type": "Creative", "link": "", "difficulty": "Easy", "duration": "15-30 minutes"},
    {"activity": "Go on a nature walk", "key": "11", "participants": "1-4", "type": "Outdoor", "link": "", "difficulty": "Easy", "duration": "30-90 minutes"},
    {"activity": "Learn basic coding online", "key": "12", "participants": "1", "type": "Educational", "link": "", "difficulty": "Medium", "duration": "1-4 hours"},
    {"activity": "Host a movie marathon", "key": "13", "participants": "1-6", "type": "Entertainment", "link": "", "difficulty": "Easy", "duration": "4-8 hours"},
    {"activity": "Paint a picture or do digital art", "key": "14", "participants": "1-2", "type": "Creative", "link": "", "difficulty": "Medium", "duration": "2-3 hours"},
    {"activity": "Organize your living space", "key": "15", "participants": "1", "type": "Productive", "link": "", "difficulty": "Medium", "duration": "1-3 hours"},
    {"activity": "Take a virtual museum tour", "key": "16", "participants": "1-4", "type": "Educational", "link": "", "difficulty": "Easy", "duration": "1-2 hours"},
    {"activity": "Host a trivia night", "key": "17", "participants": "2-10", "type": "Entertainment", "link": "", "difficulty": "Easy", "duration": "1-2 hours"},
    {"activity": "Create a scrapbook", "key": "18", "participants": "1-2", "type": "Creative", "link": "", "difficulty": "Medium", "duration": "2-4 hours"},
    {"activity": "Learn a new language", "key": "19", "participants": "1", "type": "Educational", "link": "", "difficulty": "Hard", "duration": "Ongoing"},
    {"activity": "Try a new workout routine", "key": "20", "participants": "1", "type": "Fitness", "link": "", "difficulty": "Medium", "duration": "30-60 minutes"},
    {"activity": "Write a short story", "key": "21", "participants": "1", "type": "Creative", "link": "", "difficulty": "Medium", "duration": "1-2 hours"},
    {"activity": "Do a home workout", "key": "22", "participants": "1", "type": "Fitness", "link": "", "difficulty": "Easy", "duration": "20-30 minutes"},
    {"activity": "Build a birdhouse", "key": "23", "participants": "1-2", "type": "Creative", "link": "", "difficulty": "Medium", "duration": "2-3 hours"},
    {"activity": "Learn a magic trick", "key": "24", "participants": "1", "type": "Entertainment", "link": "", "difficulty": "Easy", "duration": "30-60 minutes"},
    {"activity": "Create a vision board", "key": "25", "participants": "1", "type": "Productive", "link": "", "difficulty": "Easy", "duration": "1-2 hours"},
    {"activity": "Bake homemade bread", "key": "26", "participants": "1-2", "type": "Cooking", "link": "", "difficulty": "Medium", "duration": "2-4 hours"},
    {"activity": "Try origami", "key": "27", "participants": "1", "type": "Creative", "link": "", "difficulty": "Easy", "duration": "30-60 minutes"},
    {"activity": "Explore stargazing", "key": "28", "participants": "1-2", "type": "Outdoor", "link": "", "difficulty": "Easy", "duration": "1-2 hours"},
    {"activity": "Experiment with photography", "key": "29", "participants": "1", "type": "Creative", "link": "", "difficulty": "Medium", "duration": "2-3 hours"},
    {"activity": "Plan a themed dinner", "key": "30", "participants": "1-4", "type": "Cooking", "link": "", "difficulty": "Medium", "duration": "1-2 hours"},
    {"activity": "Learn a new dance", "key": "31", "participants": "1", "type": "Fitness", "link": "", "difficulty": "Medium", "duration": "30-60 minutes"},
    {"activity": "Make homemade candles", "key": "32", "participants": "1-2", "type": "Creative", "link": "", "difficulty": "Medium", "duration": "2-3 hours"},
    {"activity": "Research genealogy", "key": "33", "participants": "1", "type": "Educational", "link": "", "difficulty": "Medium", "duration": "1-3 hours"},
    {"activity": "Reorganize your bookshelf", "key": "34", "participants": "1", "type": "Productive", "link": "", "difficulty": "Easy", "duration": "1-2 hours"},
    {"activity": "Host a karaoke night", "key": "35", "participants": "2-10", "type": "Entertainment", "link": "", "difficulty": "Easy", "duration": "2-3 hours"},
    {"activity": "Build a puzzle", "key": "36", "participants": "1-2", "type": "Entertainment", "link": "", "difficulty": "Medium", "duration": "2-4 hours"},
    {"activity": "Create a time capsule", "key": "37", "participants": "1-4", "type": "Creative", "link": "", "difficulty": "Easy", "duration": "1-2 hours"},
    {"activity": "Explore a local park", "key": "38", "participants": "1-6", "type": "Outdoor", "link": "", "difficulty": "Easy", "duration": "2-3 hours"},
    {"activity": "Write a poem", "key": "39", "participants": "1", "type": "Creative", "link": "", "difficulty": "Easy", "duration": "1-2 hours"},
    {"activity": "Learn a card game", "key": "40", "participants": "2-6", "type": "Entertainment", "link": "", "difficulty": "Easy", "duration": "1-2 hours"},
    {"activity": "Practice calligraphy", "key": "41", "participants": "1", "type": "Creative", "link": "", "difficulty": "Medium", "duration": "1-2 hours"},
    {"activity": "Start journaling", "key": "42", "participants": "1", "type": "Wellness", "link": "", "difficulty": "Easy", "duration": "10-20 minutes"},
    {"activity": "Host a game night", "key": "43", "participants": "2-10", "type": "Entertainment", "link": "", "difficulty": "Easy", "duration": "3-4 hours"},
    {"activity": "Create a digital photo album", "key": "44", "participants": "1", "type": "Creative", "link": "", "difficulty": "Medium", "duration": "1-2 hours"},
    {"activity": "Try embrokeyery", "key": "45", "participants": "1", "type": "Creative", "link": "", "difficulty": "Medium", "duration": "2-3 hours"},
    {"activity": "Go bird watching", "key": "46", "participants": "1-2", "type": "Outdoor", "link": "", "difficulty": "Easy", "duration": "1-2 hours"},
    {"activity": "Experiment with watercolor painting", "key": "47", "participants": "1", "type": "Creative", "link": "", "difficulty": "Medium", "duration": "2-3 hours"},
    {"activity": "Learn to play an instrument", "key": "48", "participants": "1", "type": "Creative", "link": "", "difficulty": "Hard", "duration": "Ongoing"},  
    {"activity": "Decorate your home", "key": "49", "participants": "1-2", "type": "Productive", "link": "", "difficulty": "Medium", "duration": "2-4 hours"},
    {"activity": "Plant indoor succulents", "key": "50", "participants": "1", "type": "Creative", "link": "", "difficulty": "Easy", "duration": "1-2 hours"},
    {"activity": "Learn a new knitting pattern", "key": "51", "participants": "1", "type": "Creative", "link": "", "difficulty": "Medium", "duration": "2-3 hours"},
    {"activity": "Host a virtual book club", "key": "52", "participants": "2-10", "type": "Educational", "link": "", "difficulty": "Easy", "duration": "1-2 hours"},
    {"activity": "Build a LEGO creation", "key": "53", "participants": "1-4", "type": "Creative", "link": "", "difficulty": "Medium", "duration": "2-3 hours"},
    {"activity": "Do a science experiment at home", "key": "54", "participants": "1-4", "type": "Educational", "link": "", "difficulty": "Medium", "duration": "1-2 hours"},
    {"activity": "Explore online art galleries", "key": "55", "participants": "1", "type": "Educational", "link": "", "difficulty": "Easy", "duration": "1-2 hours"},
    {"activity": "Learn about astronomy", "key": "56", "participants": "1", "type": "Educational", "link": "", "difficulty": "Medium", "duration": "1-2 hours"},
    {"activity": "Create a workout playlist", "key": "57", "participants": "1", "type": "Creative", "link": "", "difficulty": "Easy", "duration": "30-60 minutes"},
    {"activity": "Design a custom t-shirt", "key": "58", "participants": "1-2", "type": "Creative", "link": "", "difficulty": "Medium", "duration": "2-3 hours"},
    {"activity": "Learn basic origami", "key": "59", "participants": "1", "type": "Creative", "link": "", "difficulty": "Easy", "duration": "30-60 minutes"},
    {"activity": "Research a historical event", "key": "60", "participants": "1", "type": "Educational", "link": "", "difficulty": "Medium", "duration": "1-2 hours"},
    {"activity": "Organize a virtual trivia game", "key": "61", "participants": "2-10", "type": "Entertainment", "link": "", "difficulty": "Easy", "duration": "1-2 hours"},
    {"activity": "Create handmade cards", "key": "62", "participants": "1-2", "type": "Creative", "link": "", "difficulty": "Medium", "duration": "1-2 hours"},
    {"activity": "Plan a DIY home project", "key": "63", "participants": "1-2", "type": "Productive", "link": "", "difficulty": "Medium", "duration": "2-4 hours"},
    {"activity": "Watch a documentary", "key": "64", "participants": "1", "type": "Educational", "link": "", "difficulty": "Easy", "duration": "1-2 hours"},
    {"activity": "Try a virtual escape room", "key": "65", "participants": "2-6", "type": "Entertainment", "link": "", "difficulty": "Medium", "duration": "1-2 hours"},
    {"activity": "Bake cookies from scratch", "key": "66", "participants": "1-2", "type": "Cooking", "link": "", "difficulty": "Medium", "duration": "1-2 hours"},
    {"activity": "Create a puzzle", "key": "67", "participants": "1", "type": "Creative", "link": "", "difficulty": "Medium", "duration": "1-2 hours"},
    {"activity": "Experiment with digital design", "key": "68", "participants": "1", "type": "Creative", "link": "", "difficulty": "Medium", "duration": "1-3 hours"},
    {"activity": "Try making sushi", "key": "69", "participants": "1-2", "type": "Cooking", "link": "", "difficulty": "Hard", "duration": "1-2 hours"},
    {"activity": "Go for a scenic drive", "key": "70", "participants": "1-4", "type": "Outdoor", "link": "", "difficulty": "Easy", "duration": "1-2 hours"},
    {"activity": "Practice playing a musical scale", "key": "71", "participants": "1", "type": "Creative", "link": "", "difficulty": "Medium", "duration": "30-60 minutes"},
    {"activity": "Host a mini talent show", "key": "72", "participants": "2-10", "type": "Entertainment", "link": "", "difficulty": "Easy", "duration": "2-3 hours"},
    {"activity": "Learn about constellations", "key": "73", "participants": "1-2", "type": "Educational", "link": "", "difficulty": "Easy", "duration": "1-2 hours"},
    {"activity": "Make a travel itinerary", "key": "74", "participants": "1", "type": "Creative", "link": "", "difficulty": "Medium", "duration": "1-2 hours"},
    {"activity": "Explore your family history", "key": "75", "participants": "1", "type": "Educational", "link": "", "difficulty": "Medium", "duration": "1-3 hours"},
    {"activity": "Design a board game", "key": "76", "participants": "1-2", "type": "Creative", "link": "", "difficulty": "Hard", "duration": "2-4 hours"},
    {"activity": "Recreate a famous painting", "key": "77", "participants": "1", "type": "Creative", "link": "", "difficulty": "Medium", "duration": "2-3 hours"},
    {"activity": "Plan a small garden project", "key": "78", "participants": "1-2", "type": "Outdoor", "link": "", "difficulty": "Medium", "duration": "2-4 hours"},
    {"activity": "Host a themed potluck", "key": "79", "participants": "3-10", "type": "Cooking", "link": "", "difficulty": "Medium", "duration": "2-3 hours"},
    {"activity": "Learn about world cultures", "key": "80", "participants": "1", "type": "Educational", "link": "", "difficulty": "Easy", "duration": "1-2 hours"},
    {"activity": "Do a crossword puzzle", "key": "81", "participants": "1", "type": "Entertainment", "link": "", "difficulty": "Medium", "duration": "30-60 minutes"},
    {"activity": "Write a personal essay", "key": "82", "participants": "1", "type": "Creative", "link": "", "difficulty": "Medium", "duration": "1-2 hours"},
    {"activity": "Test out a new hairstyle", "key": "83", "participants": "1", "type": "Creative", "link": "", "difficulty": "Easy", "duration": "30-60 minutes"},
    {"activity": "Learn basic sewing techniques", "key": "84", "participants": "1", "type": "Educational", "link": "", "difficulty": "Medium", "duration": "1-3 hours"},
    {"activity": "Create a social media post series", "key": "85", "participants": "1", "type": "Creative", "link": "", "difficulty": "Medium", "duration": "1-2 hours"},
    {"activity": "Cook a family recipe", "key": "86", "participants": "1-2", "type": "Cooking", "link": "", "difficulty": "Medium", "duration": "1-2 hours"},
    {"activity": "Host a virtual hangout", "key": "87", "participants": "2-10", "type": "Entertainment", "link": "", "difficulty": "Easy", "duration": "1-2 hours"},
    {"activity": "Explore online language tools", "key": "88", "participants": "1", "type": "Educational", "link": "", "difficulty": "Medium", "duration": "1-2 hours"},
    {"activity": "Plan a DIY photo shoot", "key": "89", "participants": "1-4", "type": "Creative", "link": "", "difficulty": "Medium", "duration": "2-3 hours"},
    {"activity": "Learn about local history", "key": "90", "participants": "1", "type": "Educational", "link": "", "difficulty": "Medium", "duration": "1-3 hours"},
    {"activity": "Plan a virtual celebration", "key": "91", "participants": "2-10", "type": "Entertainment", "link": "", "difficulty": "Medium", "duration": "1-2 hours"},
    {"activity": "Create handmade jewelry", "key": "92", "participants": "1-2", "type": "Creative", "link": "", "difficulty": "Medium", "duration": "2-3 hours"},
    {"activity": "Explore creative writing prompts", "key": "93", "participants": "1", "type": "Creative", "link": "", "difficulty": "Medium", "duration": "1-2 hours"},
    {"activity": "Learn about famous landmarks", "key": "94", "participants": "1", "type": "Educational", "link": "", "difficulty": "Easy", "duration": "1-2 hours"},
    {"activity": "Try a new hobby", "key": "95", "participants": "1", "type": "Educational", "link": "", "difficulty": "Medium", "duration": "2-4 hours"},
    {"activity": "Create a terrarium", "key": "96", "participants": "1-2", "type": "Creative", "link": "", "difficulty": "Medium", "duration": "1-2 hours"},
    {"activity": "Make a DIY video tutorial", "key": "97", "participants": "1", "type": "Creative", "link": "", "difficulty": "Hard", "duration": "2-4 hours"},
    {"activity": "Learn basic gardening skills", "key": "98", "participants": "1", "type": "Educational", "link": "", "difficulty": "Medium", "duration": "2-4 hours"},
    {"activity": "Host a virtual music jam", "key": "99", "participants": "2-6", "type": "Entertainment", "link": "", "difficulty": "Medium", "duration": "2-3 hours"},
    {"activity": "Design a custom calendar", "key": "100", "participants": "1", "type": "Creative", "link": "", "difficulty": "Medium", "duration": "2-3 hours"}
]
