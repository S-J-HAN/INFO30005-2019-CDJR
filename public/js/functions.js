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

function switchSort(element) {
  var parent = document.getElementById('sortby buttons');
  for (var i = 0; i < parent.children.length; i++) {
    button = parent.children[i];
    gallery = document.getElementById(button.id + ' gallery');
    if (button != element) {
      button.classList.remove('selected');
      if (gallery) {
        gallery.style.display = 'none';
      }
    } else {
      button.classList.add('selected');
      if (gallery) {
        gallery.style.display = 'block';
      }
    }
  }
}

function toggleTag(element) {
  if (element.classList.contains('selected')) {
    element.classList.remove('selected');
  } else {
    element.classList.add('selected');
  }
}
