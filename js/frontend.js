function getData(){
  var xmlHttp = new XMLHttpRequest();
  var url = "http://localhost:3000/output";
  xmlHttp.open("GET", url, true);
  xmlHttp.send();
  xmlHttp.onreadystatechange = function() { 
      if(this.readyState == 4 && this.status == 200){
        var obj = JSON.parse(this.responseText);
        //getting the data from json file
        //details of standard document
        var standardNouns = obj[0].standard_document_nouns;
        var standardAdjectives = obj[0].standard_document_adjectives;
        var standardVerbs = obj[0].standard_document_verbs;
        var standardWordCount = obj[0].standard_document_wordCount;
        //details of eval document
        var evalNouns = obj[1].evaluated_document_nouns;
        var evalAdjectives = obj[1].evaluated_document_adjectives;
        var evalVerbs = obj[1].evaluated_document_verbs;
        var evalWordCount = obj[1].evaluated_document_wordCount;
        //commmon properties
        var commonNouns = obj[2].similar_nouns;
        var commonAdjectives = obj[2].similar_adjectives;
        var commonVerbs = obj[2].similar_verbs;
        var total = standardAdjectives+standardNouns+standardVerbs;
        var marks = commonNouns+commonVerbs+commonAdjectives;
        var percentage = Math.round((marks/total)*100);
        var html_code = "<p class = \"resultData mt-5\"><table class=\"table table-bordered\"><tbody><tr><th>Table</th><th>Word Count</th><th>Nouns</th><th>Adjectives</th><th>Verbs</th></tr><tr><th>Your Document</th><td>"+evalWordCount+"</td><td>"+evalNouns+"</td><td>"+evalAdjectives+"</td><td>"+evalVerbs+"</td></tr><tr><th>Standard Document</th><td>"+standardWordCount+"</td><td>"+standardNouns+"</td><td>"+standardAdjectives+"</td><td>"+standardVerbs+"</td></tr></tbody></table><br></p><p class = \"new-content\">Your document has<b> "+commonNouns+"</b> common nouns with our standard document.<br>Your document has<b> "+commonAdjectives+"</b> common adjectives with our standard document.<br>Your document has<b> "+commonVerbs+"</b> common verbs with our standard document.<br><br>Your final score : <b>"+percentage+"%</b></p>";
        //inserting the content on html page
        document.getElementById('data').innerHTML=html_code;
    }  
  }
}
