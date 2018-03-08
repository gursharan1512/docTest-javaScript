//fs node js .. taking up only .txt files and natural
var fs = require('fs');
var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
//pos tagger
var path = require('path');
var base_folder = path.join(path.dirname(require.resolve("natural")), "brill_pos_tagger");
var rulesFilename = base_folder + "/data/English/tr_from_posjs.txt";
var lexiconFilename = base_folder + "/data/English/lexicon_from_posjs.json";
var defaultCategory = 'N';
var lexicon = new natural.Lexicon(lexiconFilename, defaultCategory);
var rules = new natural.RuleSet(rulesFilename);
var tagger = new natural.BrillPOSTagger(lexicon, rules);
//pos tagger over
//global variables to be displayed in json at end
var evalNouns = [];
var standardNouns = [];
var evalAdjectives = [];
var standardAdjectives = [];
var evalVerbs = [];
var standardVerbs = [];
var similarNouns = [];
var similarAdjectives = [];
var similarVerbs = [];
//reading the documents
var evalDocument = fs.readFileSync('../documents/eval.txt','utf-8');
var standardDocument = fs.readFileSync('../documents/standard.txt','utf-8');
//tokenizing the documents
var standardTokens = tokenizer.tokenize(standardDocument);
var evalTokens = tokenizer.tokenize(evalDocument);
//lengths of respective documents
var standardLength = standardTokens.length;
var evalLength = evalTokens.length;
//twenty percent length relaxation
var range = (standardTokens.length*20)/100
if(evalLength <= standardLength-range || evalLength >= standardLength+range){
  console.log("Document size invalid");
  return;
}
else{
  //call for calculating everything
  calculate(standardTokens, evalTokens);
}
//function to count nouns, adjectives and verbs
function calculate(standard, evaluate){
  var standardTagged = tagger.tag(standard);
  var evalTagged = tagger.tag(evaluate);
  //for standard document
  for(var i=0; i < standardTagged.length; i++){
    if(standardTagged[i][1] == "NN"|"NNS"|"NNP"|"NNPS")
      standardNouns.push(standardTagged[i][0]);
    else if(standardTagged[i][1] == "JJ"|"JJR"|"JJS")
      standardAdjectives.push(standardTagged[i][0]);
    else if(standardTagged[i][1] == "VB"|"VBD"|"VBG"|"VBN"|"VBP")
      standardVerbs.push(standardTagged[i][0]);
  }
    //for evaluation document
  for(var i=0; i < evalTagged.length; i++){ 
    if(evalTagged[i][1] == "NN"|"NNS"|"NNP"|"NNPS")
      evalNouns.push(evalTagged[i][0]);
    else if(evalTagged[i][1] == "JJ"|"JJR"|"JJS")
      evalAdjectives.push(evalTagged[i][0]);
    else if(evalTagged[i][1] == "VB"|"VBD"|"VBG"|"VBN"|"VBP")
      evalVerbs.push(evalTagged[i][0]);
  }
   compareNouns();
   compareAdjectives();
   compareVerbs();
   writeJSON();
  }
//comparing nouns of both documents and calculating noun percentage
function compareNouns(){
  var corpus = standardNouns;
  var spellcheck = new natural.Spellcheck(corpus);
  //comparing each noun of evalDoc with corpus
  for(let i = 0; i < evalNouns.length; i++){
	if(spellcheck.isCorrect(evalNouns[i])){
		similarNouns.push(evalNouns[i]);
	}
}   
} 
function compareAdjectives(){
  var corpus = standardAdjectives;
  var spellcheck = new natural.Spellcheck(corpus);
  //comparing each noun of evalDoc with corpus
  for(let i = 0; i < evalAdjectives.length; i++){
	if(spellcheck.isCorrect(evalAdjectives[i])){
		similarAdjectives.push(evalAdjectives[i]);
	}
}   
} 
function compareVerbs(){
  var corpus = standardVerbs;
  var spellcheck = new natural.Spellcheck(corpus);
  //comparing each noun of evalDoc with corpus
  for(let i = 0; i < evalVerbs.length; i++){
	if(spellcheck.isCorrect(evalVerbs[i])){
		similarVerbs.push(evalVerbs[i]);
	}
} 
} 
//function to make and write into JSON file
 function writeJSON(){
    var score = {
"output":[
        {
          wordCount : standardLength,
          nouns : standardNouns.length,
          adjectives : standardAdjectives.length,
          verbs : standardVerbs.length
        }, 
        {
          wordCount : evalLength,
          nouns : evalNouns.length,
          adjectives : evalAdjectives.length,
          verbs : evalVerbs.length
        }, {
          nouns : similarNouns.length,
          adjectives : similarAdjectives.length,
          verbs : similarVerbs.length
      }
    ]
    }
  //object to string
  var json = JSON.stringify(score, null, 2);
  //writing in json file
  fs.writeFileSync('result.json',json)
 }