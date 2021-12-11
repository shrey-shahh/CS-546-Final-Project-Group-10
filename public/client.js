const mainUrl = "http://localhost:3000/api/";
$(document).ready(function(){
    homeClicked()
});
function hideAllDiv(){
    $("#home").hide();
    $("#searchjob").hide();
    $("#viewapplicaions").hide();
    $("#companyprofile").hide();
    $("#profile").hide();
    $("#feedback").hide();
    $("#addjob").hide();
    $("#viewjob").hide();
    $("#application").hide();
    $("#changePassword").hide();
    $("#feedback-form").hide();
    $("#viewFeedbacks").hide();
}
function homeClicked(){
    hideAllDiv();
    // initial api call using ajax goes here, for click events create new functions and do ajax call
    /*
    sample ajax get call example
    ===================================================================
    $.ajax({url: mainUrl+"get-jobs",method:'get', success: function(result){
        console.log(result);
        // create html using result and append on page using id
    }});
    ===================================================================
    sample ajax post call
    data = {
        comments:"Hello", rating: 5, userId : '5f92cbf10cf217478ba93561', companyId : '5f92cdce0cf217478ba93563'
    }
    $.ajax({url: mainUrl+"create-feedback", method:'post', data, success: function(result){
        console.log(result);
        // create html using result and append on page using id
    }});
    */
    $("#home").show();
}
function searchJobClicked(id){
    $("#joblist-company").empty();
        let html = "<tbody><tr><th>Company</th><th>Job Title</th><th>Job Type</th><th>Field</th><th>Job Location</th><th>Job Description</th><th>Experience</th><th>Salary</th><th>Vacancy</th><th>Rating</th><th>Apply</th></tr>";
    jobList = [];
    hideAllDiv();
    $.ajax({url: mainUrl+"get-application-by-jobseeker/"+id,method:'get', success:async function(applications){
    $.ajax({url: mainUrl+"get-jobs",method:'get', success:async function(result){
        result = result.filter(x=>x.status == "show");
        jobList = result;
        for(i=0; i<result.length;i++)
        {
            html = html + "<tr>"
            
            await $.ajax({url: mainUrl+"get-user-by-email/"+result[i].email,method:'get', success: function(user){
                html = html + "<td>" +user.fullname.toString()+ "</td>";
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
                    console.log(rating)
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
            if(applications.find(x=>x.jobId == result[i]._id && x.jobseekerId == id))
            {
                html = html + "<td><button class=\"btn btn-success\" >Applied</button></td></tr>"
            }
            else{
                html = html + "<td><button class=\"btn btn-danger\" onclick=\"applyForJob('"+id+"','"+result[i]._id+"','"+result[i].email+"')\">Apply</button></td></tr>"
            }
        }
        html = html + "</tbody>"
        $("#joblist-company").append(html);
    }});
}});
    $("#searchjob").show();
}
function applyForJob(jobseekerId, jobId, email)
{
    data = {
        jobId:jobId, jobseekerId:jobseekerId, companyId : email, jobStatus:"apply"
    }
    $.ajax({url: mainUrl+"create-application", method:'post', data, success: function(result){
            searchJobClicked(jobseekerId);
    }});
}
function viewApplicationsClicked(id){
    hideAllDiv();
    let html = '<tbody></tbody><tr><th>Job Title</th><th>Job Type</th><th>Job Location</th><th>Salary</th><th>Vacancy</th></tr>';
    $.ajax({url: mainUrl+"get-application-by-jobseeker/"+id,method:'get', success: async function(result){
        for(i=0;i<result.length;i++)
        {
    await $.ajax({url: mainUrl+"get-job/"+result[i].jobId,method:'get', success:async function(job){
        html = html + "<tr>"+
        "<td>"+job.title+"</td>"+
        "<td>"+job.jobtype+"</td>"+
        "<td>"+job.location+"</td>"+
        "<td>"+job.salaryrange+"</td>"+
        "<td>"+job.vacancy+"</td>"+
        +"</tr>"
    }});
    }
    html = html + '</tbody';
    if(!$("#applicationlist")[0].outerHTML.toString().includes("<td>"))
        {
            $("#applicationlist").html(html);
        }
    }});
    $("#viewapplicaions").show();
}
function companyProfileClicked(id){
    hideAllDiv();
    $.ajax({url: mainUrl+"get-user/"+id,method:'get', success: function(result){
        $("#pid").val(result._id);
        $("#pfullname").val(result.fullname);
        $("#pcontactno").val(result.contactno);
        $("#paddress").val(result.address);
        $("#pemail").val(result.email);
        $("#peducation").val(result.education);
        $('#pblah').attr('src', 'http://localhost:3000/logos/'+result.logo);
        $('#pblah').show();
        // create html using result and append on page using id
    }});
    $("#companyprofile").show();
}
function profileClicked(id){
    hideAllDiv();
    $.ajax({url: mainUrl+"get-user/"+id,method:'get', success: function(result){
        $("#pid").val(result._id);
        $("#pfullname").val(result.fullname);
        $("#pcontactno").val(result.contactno);
        $("#paddress").val(result.address);
        $("#pemail").val(result.email);
        $("#peducation").val(result.education);
        // create html using result and append on page using id
    }});
    $("#profile").show();
}
function feedbackClicked(id)
{
    hideAllDiv();
    $.ajax({url: mainUrl+"get-application-by-jobseeker/"+id,method:'get', success: async function(result){
        let companyList = [];
        let html = '<tbody></tbody><tr><th>Company Name</th><th>Rate</th></tr>';
        let feedbackList = [];
        await $.ajax({url: mainUrl+"get-feedbacks",method:'get', success: function(result){
            feedbackList = result;
        }});
        for(let application of result)
        {
            if(!companyList.includes(application.companyId))
            {
                companyList.push(application.companyId)
            }
        }
        for(let cid of companyList)
        {
            if(cid)
            {
            await $.ajax({url: mainUrl+"get-user-by-email/"+cid,method:'get', success: function(result){
                if(result)
                {
                    html = html + "<tr>"+
                    "<td>"+result.fullname+"</td>"
                    let feedback = feedbackList.find(x=>x.companyId == result._id && x.userId == id);
                    if(!feedback)
                    {
                       html = html + "<td><button class=\"btn btn-primary\" onclick=\"updateRating('"+id+"','"+result._id+"','"+result.fullname+"')\">Rate</button></td>"
                    }
                    else{
                        html = html + "<td><button class=\"btn btn-danger\" >Rated</button></td>"
                    }                    
                    html = html + "</tr>"
                }
            }});
            }
        }
        html = html + "</tbody>"
        $("#feedbackList").html(html);
        
    }});
    $("#feedback").show();
    $("#feedbackList").show();
}
function viewFeedbacksClicked(email)
{
    hideAllDiv();
    let html = "<tbody><tr><th>User</th><th>Rating</th><th>Comment</th></tr>";
    $.ajax({url: mainUrl+"get-feedbacks/"+email,method:'get', success:async function(result){
        for(i=0;i<result.length;i++)
        {
            html = html + "<tr>"
            await $.ajax({url: mainUrl+"get-user/"+result[i].userId,method:'get', success: function(user){
                html = html + "<td>"+user.fullname+"</td>"
            }});
                    if(result[i].rating == 5)
                    {
                        html = html + "<td>&#9733;&#9733;&#9733;&#9733;&#9733;</td>"
                    }
                    else if(result[i].rating == 4)
                    {
                        html = html + "<td>&#9733;&#9733;&#9733;&#9733;&#9734;</td>"
                    }
                    else if(result[i].rating == 3)
                    {
                        html = html + "<td>&#9733;&#9733;&#9733;&#9734;&#9734;</td>"
                    }
                    else if(result[i].rating == 2)
                    {
                        html = html + "<td>&#9733;&#9733;&#9734;&#9734;&#9734;</td>"
                    }
                    else{
                        html = html + "<td>&#9733;&#9734;&#9734;&#9734;&#9734;</td>"
                    }
            html = html + "<td>"+result[i].comments+"</td>"
            html = html + "</tr>"
        }
        html = html + "</tbody>"
        if(!$("#feedbacks-list")[0].outerHTML.toString().includes("<td>"))
        {
            $("#feedbacks-list").html(html);
        }
    }});
    $("#viewFeedbacks").show();
}
function updateRating(jobseekerid,companyId, companyName)
{
    hideAllDiv();
    $("#feedback").show();
    $("#feedbackList").hide();
    $("#feedback-form").show();
    $("#cname").text(companyName)
    $("#userId").val(jobseekerid)
    $("#companyId").val(companyId)
}
function addJobClicked(){
    hideAllDiv()
    // initial api call using ajax goes here, for click events create new functions and do ajax call
    $("#addjob").show();
}
function submitRatingForm(id)
{
    $("#rating-error").hide();
    ratingFormData = getFormData($("#feedback-form"));
    $.ajax({url: mainUrl+"create-feedback", method:'post', data:ratingFormData, success:async function(result){
        $("#rating-error").hide();
        feedbackClicked(id);
        // create html using result and append on page using id
    },
    error:function(err){
        $("#rating-error").show();
        $("#rating-error").text("*"+err.responseJSON.error);
    }
});
}
function viewJobClicked(email){
    hideAllDiv();
    $("#joblist-table").show();
    $("#joblist-company").empty();

    $("#job-edit-div").hide();
    $.ajax({url: mainUrl+"get-company-job/"+email,method:'get', success: function(result){
        let html = "<tbody><tr><th>Job Title</th><th>Job Type</th><th>Field</th><th>Job Location</th><th>Job Description</th><th>Experience</th><th>Salary</th><th>Vacancy</th><th>Edit</th><th>Status</th></tr>";
        for(i=0; i<result.length;i++)
        {
            html = html + "<tr>"+
            "<td>"+result[i].title+"</td>"+
            "<td>"+result[i].jobtype+"</td>"+
            "<td>"+result[i].fieldtype+"</td>"+
            "<td>"+result[i].location+"</td>"+
            "<td>"+result[i].description+"</td>"+
            "<td>"+result[i].experience+"</td>"+
            "<td>"+result[i].salaryrange+"</td>"+
            "<td>"+result[i].vacancy+"</td>"+
            "<td><button class=\"btn btn-primary\" onclick=\"editJob('"+result[i]._id+"')\" >Edit</td>"

            if(result[i].status == "show")
            {   
                html = html + "<td><button class=\"btn btn-success\" onclick=\"editJobStatus('"+result[i]._id+"','hide','"+email+"')\" >Show</td>"
            }
            else if(result[i].status == "hide"){
                html = html + "<td><button class=\"btn btn-danger\" onclick=\"editJobStatus('"+result[i]._id+"','show','"+email+"')\" >Hide</td>"
            }

          html = html + "</tr>"
        }
        html = html + "</tbody>"
        if(!$("#joblist-company")[0].outerHTML.toString().includes("<td>"))
        {
            $("#joblist-company").html(html);
        }
    }});
    $("#viewjob").show();
}
function editJobStatus(_id, status, email)
{
    data = {
        _id,
        status
    }
    $.ajax({url: mainUrl+"edit-job-status/",data,method:'post', success: function(result){
        viewJobClicked(email)
    }});
}
function editJob(id)
{
    $.ajax({url: mainUrl+"get-job/"+id,method:'get', success: function(result){
        $("#joblist-table").hide();
        $("#job-edit-div").show();
        $("#eid").val(id);
        $("#etitle").val(result.title);
        $("#ejobtype").val(result.jobtype);
        $("#efieldtype").val(result.fieldtype);
        $("#edescription").val(result.description);
        $("#elocation").val(result.location);
        $("#eexperience").val(result.experience);
        $("#esalaryrange").val(result.salaryrange);
        $("#evacancy").val(result.vacancy);
        $("#estatus").val(result.status);
    }});

}
function applicationClicked(id){
    hideAllDiv();
    $.ajax({url: mainUrl+"get-application-by-company/"+id,method:'get', success: async function(result){
        let html = "<tbody>";
        for(i=0; i<result.length;i++)
        {
            let jobId = result[i].jobId;
            let userResult = {};
            await $.ajax({url: mainUrl+"get-user/"+result[i].jobseekerId,method:'get', success: async function(userresult){
                html = html + "<tr><td>"+ userresult.fullname + "</td><td>"+userresult.email+"</td><td>"+userresult.contactno+"</td>"
                userResult = userresult;
            }});
            await $.ajax({url: mainUrl+"get-job/"+jobId,method:'get', success: function(jobresult){
                html = html + "<td>"+jobresult.title+"</td><td>"+jobresult.jobtype+"</td><td><a target=\"_blank\" href=\"http://localhost:3000/resumes/"+userResult.resume+"\"><button class\"btn btn-primary\">Resume</a></td>"                    
            }});
            html = html + "</tr>"
        }
        html = html + "</tbody>"
        if(!$("#applicationlist-company")[0].outerHTML.toString().includes("<td>"))
        {
            $("#applicationlist-company").append(html);
        }
    }});
    $("#application").show();
}
function changePasswordClicked(){
    hideAllDiv();
    // initial api call using ajax goes here, for click events create new functions and do ajax call
    $("#changePassword").show();
}
function getBase64(input)
{
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        
        reader.onload = function(e) {
          $('#blah').attr('src', e.target.result);
          $('#blah').show();
          $('#pblah').attr('src', e.target.result);
          $('#pblah').show();
        }
        
        reader.readAsDataURL(input.files[0]); // convert to base64 string
      }
}
function submitJobForm(email)
{
    $("#job-form-error").hide();
    jobFormData = getFormData($("#job-form"));
    $.ajax({url: mainUrl+"create-job", method:'post', data:jobFormData, success: function(result){
        if(result.jobInserted)
        {
            $(':input','#job-form').val('')
            viewJobClicked(email)
        }
    },
    error:function(err){
            $("#job-form-error").text("*"+err.responseJSON.error)
            $("#job-form-error").show();
    }
});
}
function getFormData(form){
    var unindexed_array = form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });
    return indexed_array;
}
function submitEditJobForm(email){
    $("#ejob-form-error").hide();
    jobFormData = getFormData($("#job-form-edit"));
    $.ajax({url: mainUrl+"update-job", method:'post', data:jobFormData, success: function(result){
        if(result.jobUpdated)
        {
            $(':input','#job-form-edit').val('')
            viewJobClicked(email)
        }
    },
    error:function(err){
            $("#ejob-form-error").text("*"+err.responseJSON.error)
            $("#ejob-form-error").show();
    }
});
}
function submitUpdateProfileForm(){
    userFormData = getFormData($("#signup-edit-form"));
    $("#updatep-form-success").hide();
    $("#updatep-form-error").hide();
    $.ajax({url: mainUrl+"update-user", method:'post', data:userFormData, success: function(result){
        if(result.userUpdated)
        {
        $("#updatep-form-success").text("User Profile Updated Successfully")
        $("#updatep-form-success").show();
            $(':input','#signup-edit-form').val('')
        }
    },
    error:function(err){
        $("#updatep-form-error").text("*"+err.responseJSON.error)
        $("#updatep-form-error").show();
    }
});
}
function submitChangePasswordForm()
{
    cpFormData = getFormData($("#change-password-form"));
    $("#cp-form-success").hide();
    $("#cp-form-error").hide();
    $.ajax({url: mainUrl+"change-password", method:'post', data:cpFormData, success: function(result){
        window.location.href = "http://localhost:3000/logout";
    },
    error:function(err){
        window.location.href = "http://localhost:3000/logout";
    }
});
}