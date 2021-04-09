var showSignUpFormText = document.getElementById('showSignUpFormText');
var showSignInFormText = document.getElementById('showSignInFormText');
var showSignInFormText2 = document.getElementById('showSignInFormText2');
var showResetFormText = document.getElementById('showResetFormText');
var signInForm = document.getElementById('signInForm');
var signUpForm = document.getElementById('signUpForm');
var resetForm = document.getElementById('resetForm');
var securityQuestionForm = document.getElementById('securityQuestionForm');
var securityAnswerForm = document.getElementById('securityAnswerForm');
var emailForPasswordReset = document.getElementById('emailForPasswordReset');
var getSecurityQuestionButton = document.getElementById('getSecurityQuestionButton');
var securityQuestion = document.getElementById('securityQuestion');
var securityAnswer = document.getElementById('securityAnswer');
var newPassword = document.getElementById('newPassword');
var toastError = document.getElementById('toastError');
var closeToastButton = document.getElementById('closeToastButton');

window.onload = function(){

    // todo if(sessionNotActive)
    hideDiv(signUpForm);
    hideDiv(resetForm);
    hideDiv(securityAnswerForm);

      showSignUpFormText.addEventListener('click', function(e) {
        hideDiv(signInForm);
        displayDiv(signUpForm);
        hideDiv(resetForm);
      });

      showSignInFormText.addEventListener('click', function(e) {
        displayDiv(signInForm);
        hideDiv(signUpForm);
        hideDiv(resetForm);
      });

      showResetFormText.addEventListener('click', function(e) {
        hideDiv(signInForm);
        hideDiv(signUpForm);
        displayDiv(resetForm);
      });

      showSignInFormText2.addEventListener('click', function(e) {
        displayDiv(signInForm);
        hideDiv(signUpForm);
        hideDiv(resetForm);
      });

      closeToastButton.addEventListener('click', function(e) {
        hideDiv(toastError);
      });
    /*
    // Client Side Form Field Validations
    input_email.addEventListener("input", function(event){
        if (email.validity.typeMismatch) {
            email.setCustomValidity("Please enter a valid E-Mail Address!");
          } else {
            email.setCustomValidity("");
          }
    });
    */
}

var displayDiv = function(elementId){
  elementId.style.display = "block";
}

var hideDiv = function(elementId){
  elementId.style.display = "none";
}

var getSecurityQuestion = function(){
  
  formData = {
    email: emailForPasswordReset.value
  }
  
  $.ajax({
    type : "POST",
    contentType : "application/json",
    url : "/getSecurityQuestion",
    data : JSON.stringify(formData),
    dataType : 'json',
    success : function(response) {
      hideDiv(getSecurityQuestionButton);
      displayDiv(securityAnswerForm);
      emailForPasswordReset.readOnly = true;
      securityQuestion.innerHTML = response;
    },
    error : function(e) {
      alert(e.responseJSON.errors.Username);
    }
  });
}

var resetPassword = function(){
  formData = {
    email: emailForPasswordReset.value,
    securityAnswer: securityAnswer.value,
    newPassword: newPassword.value
  }

  $.ajax({
    type : "POST",
    contentType : "application/json",
    url : "/resetPassword",
    data : JSON.stringify(formData),
    dataType : 'json',
    success : function(response) {
      alert("Password Changed Successfully! SignIn to Continue.");
      document.location.href="/";
    },
    error : function(e) {
      alert(e.responseJSON.errors.Security);
    }
  });
}