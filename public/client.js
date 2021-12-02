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
function searchJobClicked(){
    hideAllDiv();
    // initial api call using ajax goes here, for click events create new functions and do ajax call
    $("#searchjob").show();
}
function viewApplicationsClicked(id){
    hideAllDiv();
    // initial api call using ajax goes here, for click events create new functions and do ajax call
    $("#viewapplicaions").show();
}
function companyprofileClicked(id){
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
function profileClicked(){
    hideAllDiv();
    // initial api call using ajax goes here, for click events create new functions and do ajax call
    $("#profile").show();
}
function feedbackClicked(){
    hideAllDiv();
    // initial api call using ajax goes here, for click events create new functions and do ajax call
    $("#feedback").show();
}
function addJobClicked(){
    hideAllDiv()
    // initial api call using ajax goes here, for click events create new functions and do ajax call
    $("#addjob").show();
}
function viewJobClicked(email){
    hideAllDiv();
    $("#joblist-table").show();
    $("#job-edit-div").hide();
    $.ajax({url: mainUrl+"get-company-job/"+email,method:'get', success: function(result){
        let html = "";
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
          "</tr>"
        }
        if(!$("#joblist-company")[0].outerHTML.toString().includes("<td>"))
        {
            $("#joblist-company").append(html);
        }
    }});
    $("#viewjob").show();
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
        let html = "";
        for(i=0; i<result.length;i++)
        {
            let jobId = result[i].jobId;
            await $.ajax({url: mainUrl+"get-user/"+result[i].jobseekerId,method:'get', success: async function(userresult){
                html = html + "<tr><td>"+ userresult.fullname + "</td><td>"+userresult.email+"</td><td>"+userresult.contactno+"</td>"
                await $.ajax({url: mainUrl+"get-job/"+jobId,method:'get', success: function(jobresult){
                        html = html + "<td>"+jobresult.title+"</td><td>"+jobresult.jobtype+"</td><td><a target=\"_blank\" href=\"http://localhost:3000/resumes/"+userresult.resume+"\"><button class\"btn btn-primary\">Resume</a></td></tr>"
                        
                    }});
            }});
        }
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