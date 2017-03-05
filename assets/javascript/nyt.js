//NYT App 
$("document").ready(function() {

    $("#search").on('click', function() {


        //query string parameters
        var searchTerm = encodeURI($("#searchTerm").val());
        var limit = encodeURI($("#limit").val());
        // limit equals 0 if if input field is empty or a number lower than 0 is entered
        if (limit === "" || limit < 0){
            limit = 0;
        }
        var startYear = encodeURI($("#startYear").val());
        var endYear = encodeURI($("#endYear").val());
        if (startYear === "") {
            startYear = "19700101"
        }
        if (endYear === "") {
            var today = new Date()
            var yyyy = today.getFullYear().toString();
            var mm = (today.getMonth() + 1).toString();
            var dd = today.getDate().toString();
            //the month will come back as 1,2... if it is less than 9 thus the need to add a 0
            //to comply with API date format
            for (var i = 0; i < 9; i++) {
                var mmInt;
                mmInt = parseInt(mm);
                if (mmInt === i) {

                    mm = "0" + mm;
                    break;
                }
            }
            //the day will come back as 1,2... if it is less than 9 thus a need to add a 0 
            // to comply with API date format
            for (var i = 0; i < 9; i++) {
                var ddInt;
                ddInt = parseInt(dd);
                if (ddInt === i) {

                    dd = "0" + dd;
                    break;
                }
            }
            endYear = yyyy + mm + dd;
        }

        //api-key 
        var authKey = "ae02bc22e92f43a0b4018df93e2d2ac5";

        //parameters to pass into the query string 
        var parameters = $.param({
            'q': searchTerm,
            'begin_date': startYear,
            'end_date': endYear,
            'api-key': authKey
        })

        //Query URL 
        var queryURLBase = "https://api.nytimes.com/svc/search/v2/articlesearch.json?" + parameters;


        console.log(queryURLBase);


        if (limit < 10) {
            console.log(limit);
            console.log(endYear);
            console.log(startYear);

            $.ajax({
                url: queryURLBase,
                method: 'GET',
            }).done(function(data) {

                //empty the articles before loading the newly retrieved ones    
                $("#topArticles").empty();
                console.log(data);
                //create a variable to store part of the dot notation to access properties
                var response = data.response.docs;

                //limit the articles if the user selected less than 10 otherwise set it to the response length
                if (response.length < limit || limit === 0) {
                    limit = response.length
                    if (response.length < limit) {
                        alert("the records found are only " + limit);
                    }
                }

                //loop upto the limit to add the articles to #topArticles id
                for (var i = 0; i < limit; i++) {
                    //create a div and store it on article variable
                    var article = $("<div id = 'article' class = 'panel'>").css("color", "#413839").css('background', "#BCC6CC");
                    //sometimes this property comes as null thus the handling 
                    if (response[i].byline !== null) {
                        var author = response[i].byline.original;
                    } else {
                        author = "";
                    }
                    //create a variable called headLine and store the headline 
                    var headLine = response[i].headline.main;
                    //creata a variable called url and store the article's url 
                    var url = response[i].web_url;
                    // create a new link and store it on a variable
                    var link = $("<a/>");
                    //create a variable to hold the number of the article 
                    var num = $("<h4>").css("display", "inline-block");
                    //set the number of the iteration + 1 to start at 1 
                    num.text(i + 1);
                    //set the href attribute to the previously stored url
                    link.attr('href', url);
                    //set the text of the link to the previously stored headLine and format it 
                    link.text("  " + headLine).css("color", "#151B54");
                    //append a number to the link
                    article.append(num);
                    //append the link to the article div 
                    article.append(link);
                    //append a break to have the author on a new line
                    article.append("<br>");
                    //append the author to the article div
                    article.append(author);
                    //append the final article to the #topArticles div 
                    $("#topArticles").append(article);
                }

                //handle errors 
            }).fail(function(err) {
                throw err;
            });
        }else{
            alert("Enter a Number of records lower than 10")
            $("#limit").val("")
        }

    });

});
