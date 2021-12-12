const mainUrl = "http://localhost:3000/api/";
    var jobList = [];   
    $(document).ready(function(){
        $.ajax({url: mainUrl+"get-jobs",method:'get', success:async function(result){
        result = result.filter(x=>x.status == "show");
        jobList = result;
        let html = "";
        for(i=0; i<result.length;i++)
        {
            html = html + "<tr>"
            await $.ajax({url: mainUrl+"get-user-by-email/"+result[i].email,method:'get', success: function(user){
                html = html + "<td>"+user.fullname+"</td>";
            }});
            html = html + "<td>"+result[i].title+"</td>"+
            "<td>"+result[i].jobtype+"</td>"+
            "<td>"+result[i].fieldtype+"</td>"+
            "<td>"+result[i].location+"</td>"+
            "<td>"+result[i].description+"</td>"+
            "<td>"+result[i].experience+"</td>"+
            "<td>"+result[i].salaryrange+"</td>"+
            "<td>"+result[i].vacancy+"</td>"
            await $.ajax({url: mainUrl+"get-feedbacks/"+result[i].email,method:'get', success: function(ratings){
                let sum = 0;
                for(let rat of ratings)
                {
                    sum += rat.rating
                }
                if(ratings.length == 0)
                {
                    html = html + "<td>&#9734;&#9734;&#9734;&#9734;&#9734;</td>"
                }
                else
                {
                    let rating = sum/ratings.length
                    if(rating > 4)
                    {
                        html = html + "<td>&#9733;&#9733;&#9733;&#9733;&#9733;</td>"
                    }
                    else if(rating > 3)
                    {
                        html = html + "<td>&#9733;&#9733;&#9733;&#9733;&#9734;</td>"
                    }
                    else if(rating > 2)
                    {
                        html = html + "<td>&#9733;&#9733;&#9733;&#9734;&#9734;</td>"
                    }
                    else if(rating > 1)
                    {
                        html = html + "<td>&#9733;&#9733;&#9734;&#9734;&#9734;</td>"
                    }
                    else{
                        html = html + "<td>&#9733;&#9734;&#9734;&#9734;&#9734;</td>"
                    }
                }
            }});
            html = html + "</tr>"
        }
        if(!$("#jobListTable")[0].outerHTML.toString().includes("<td>"))
        {
            $("#jobListTable").append(html);
        }
    }});
      });
     async function selected(value){
        var result = [];
        if(value)
        {
            result = jobList.filter(x=>x.jobtype == value)
        }
        else{
            result = jobList;
        }
        $("#jobListTable").empty();
        let html = "<tbody><tr><th>Company</th><th>Job Title</th><th>Job Type</th><th>Field</th><th>Job Location</th><th>Job Description</th><th>Experience</th><th>Salary</th><th>Vacancy</th><th>Rating</th></tr>";
        for(i=0; i<result.length;i++)
        {
            html = html + "<tr>"
            await $.ajax({url: mainUrl+"get-user-by-email/"+result[i].email,method:'get', success: function(user){
                html = html + "<td>"+user.fullname+"</td>";
            }});
            html = html + "<td>"+result[i].title+"</td>"+
            "<td>"+result[i].jobtype+"</td>"+
            "<td>"+result[i].fieldtype+"</td>"+
            "<td>"+result[i].location+"</td>"+
            "<td>"+result[i].description+"</td>"+
            "<td>"+result[i].experience+"</td>"+
            "<td>"+result[i].salaryrange+"</td>"+
            "<td>"+result[i].vacancy+"</td>"
            await $.ajax({url: mainUrl+"get-feedbacks/"+result[i].email,method:'get', success: function(ratings){
                let sum = 0;
                for(let rat of ratings)
                {
                    sum += rat.rating
                }
                if(ratings.length == 0)
                {
                    html = html + "<td>&#9734;&#9734;&#9734;&#9734;&#9734;</td>"
                }
                else
                {
                    let rating = sum/ratings.length
                    if(rating > 4)
                    {
                        html = html + "<td>&#9733;&#9733;&#9733;&#9733;&#9733;</td>"
                    }
                    else if(rating > 3)
                    {
                        html = html + "<td>&#9733;&#9733;&#9733;&#9733;&#9734;</td>"
                    }
                    else if(rating > 2)
                    {
                        html = html + "<td>&#9733;&#9733;&#9733;&#9734;&#9734;</td>"
                    }
                    else if(rating > 1)
                    {
                        html = html + "<td>&#9733;&#9733;&#9734;&#9734;&#9734;</td>"
                    }
                    else{
                        html = html + "<td>&#9733;&#9734;&#9734;&#9734;&#9734;</td>"
                    }
                }
            }});
            html = html + "</tr>"
        }
        html = html + "</tbody>"
        $("#jobListTable").append(html);
      }