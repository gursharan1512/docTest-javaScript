//fs node js .. taking up only .txt files and natural
var fs = require('fs');
var natural = require('natural');
var path = require('path');
var tokenizer = new natural.WordTokenizer();
//pos tagger
var base_folder = path.join(path.dirname(require.resolve("natural")), "brill_pos_tagger");
var rulesFilename = base_folder + "/data/English/tr_from_posjs.txt";
var lexiconFilename = base_folder + "/data/English/lexicon_from_posjs.json";
var defaultCategory = 'N';
var lexicon = new natural.Lexicon(lexiconFilename, defaultCategory);
var rules = new natural.RuleSet(rulesFilename);
var tagger = new natural.BrillPOSTagger(lexicon, rules);
//pos tagger over
var evalNouns = [];
var standardNouns = [];
var evalAdjectives = [];
var standardAdjectives = [];
var evalVerbs = [];
var standardVerbs = [];
var similarNouns = [];
var similarAdjectives = [];
var similarVerbs = [];
var standardFilePath = '../documents/standard.txt';
var evalFilePath = '../documents/eval.txt';
//reading the documents
var evalDocument = fs.readFileSync(evalFilePath,'utf-8');
var standardDocument = fs.readFileSync(standardFilePath,'utf-8');
//tokenizing the documents
var standardTokens = tokenizer.tokenize(standardDocument);
var evalTokens = tokenizer.tokenize(evalDocument);
var standardLength = standardTokens.length;
var evalLength = evalTokens.length;
var range = standardTokens.length*0.2;
if(evalLength <= standardLength-range || evalLength >= standardLength+range){
  console.log("Document size invalid");
  return;
}
else{
  //call for calculating everything
  calculate(standardTokens,standardNouns,standardAdjectives,standardVerbs);
  calculate(evalTokens,evalNouns,evalAdjectives,evalVerbs);
  compare(standardNouns,evalNouns,similarNouns);
  compare(standardAdjectives,evalAdjectives,similarAdjectives);
  compare(standardVerbs,evalVerbs,similarVerbs);
  writeJSON();
}
//function to count nouns, adjectives and verbs
function calculate(docToken,noun,adjective,verb){
  var tagged = tagger.tag(docToken);
  for(var i=0; i < tagged.length; i++){
    if(tagged[i][1] == "NN"|"NNS"|"NNP"|"NNPS")
      noun.push(tagged[i][0]);
    else if(tagged[i][1] == "JJ"|"JJR"|"JJS")
      adjective.push(tagged[i][0]);
    else if(tagged[i][1] == "VB"|"VBD"|"VBG"|"VBN"|"VBP")
      verb.push(tagged[i][0]);
  }
}
function compare(standard,evaluate,similar){
  var spellcheck = new natural.Spellcheck(standard);
  //comparing each noun, adjectives and verbs of evalDoc with corpus
  for(let i = 0; i < evaluate.length; i++){
  if(spellcheck.isCorrect(evaluate[i])){
    similar.push(evaluate[i]);
  }
}   
}
//function to make and write into JSON file
 function writeJSON(){
    var score = {
"output":[
        {
          standard_document_wordCount : standardLength,
          standard_document_nouns : standardNouns.length,
          standard_document_adjectives : standardAdjectives.length,
          standard_document_verbs : standardVerbs.length
        }, 
        {
          evaluated_document_wordCount : evalLength,
          evaluated_document_nouns : evalNouns.length,
          evaluated_document_adjectives : evalAdjectives.length,
          evaluated_document_verbs : evalVerbs.length
        }, {
          similar_nouns : similarNouns.length,
          similar_adjectives : similarAdjectives.length,
          similar_verbs : similarVerbs.length
      }
    ]
    }
  //object to string
  var json = JSON.stringify(score, null, 2);
  //writing in json file
  fs.writeFileSync('result.json',json);
 }