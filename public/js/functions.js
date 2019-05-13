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

  var searchGallery = document.getElementById('search gallery');
  if (searchGallery) {
    searchGallery.style.display = 'none';
  }

  var searchBar = document.getElementById('search-bar');
  if (searchBar) {
    searchBar.value = '';
  }

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

function toggleSearch() {
  var searchGallery = document.getElementById('search gallery');
  searchGallery.style.display = 'block';

  var anim = document.getElementById('search-gallery-parent');
  anim.parentNode.replaceChild(anim.cloneNode(true), anim);

  var parent = document.getElementById('sortby buttons');
  for (var i = 0; i < parent.children.length; i++) {
    button = parent.children[i];
    gallery = document.getElementById(button.id + ' gallery');
    button.classList.remove('selected');
    if (gallery) {
      gallery.style.display = 'none';
    }
  }
}

if (document.getElementById('search-bar')) {
  document.getElementById('search-bar').onkeydown = function(event) {
    if (event.keyCode == 13) {
      if (document.getElementById('search-bar').value.length > 0) {
        var searchItems = document
          .getElementById('search-bar')
          .value.split(' ');
        toggleSearch();
        var art = document.getElementById('search-gallery-parent').children;
        for (var i = 0; i < art.length; i++) {
          var contain = false;
          var card = art[i];
          for (var j = 0; j < searchItems.length; j++) {
            var s = searchItems[j].toLowerCase();
            if (
              card
                .getAttribute('labels')
                .toLowerCase()
                .split(' ')
                .includes(s) ||
              card
                .getAttribute('user')
                .toLowerCase()
                .includes(s) ||
              card
                .getAttribute('title')
                .toLowerCase()
                .split(' ')
                .includes(s)
            ) {
              contain = true;
            }
          }
          if (contain) {
            card.style = '';
          } else {
            card.style = 'display:none';
          }
        }
      } else {
        switchSort(document.getElementById('popular'));
      }
    }
  };
}
