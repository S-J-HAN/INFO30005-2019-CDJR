$(function() {
  $(document).scroll(function() {
    var $nav = $('.sticky-top');
    $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
  });
});

$(function() {
  $('#successClose').click(function() {
    $('#successAlert').hide();
  });
});

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function(e) {
      $('#imagePreviewImage').attr('src', e.target.result);
      // $('#imagePreviewImage').attr(
      //   'background-image',
      //   'url(' + e.target.result + ')'
      // );
      $('#imagePreviewImage').hide();
      $('#imagePreviewImage').fadeIn(650);
    };
    reader.readAsDataURL(input.files[0]);
  }
}

$('#imageUpload').change(function() {
  readURL(this);
});
