//rangeSearch Genome Size

$.fn.dataTable.ext.search.push(
  function(settings, data, dataIndex) {
    var min = parseInt($('#min-genome').val(), 10);
    var max = parseInt($('#max-genome').val(), 10);
    var noGenome = parseFloat(data[2]) || 0;

    if ((isNaN(min) && isNaN(max)) ||
      (isNaN(min) && noGenome <= max) ||
      (min <= noGenome && isNaN(max)) ||
      (min <= noGenome && noGenome <= max)) {
      return true;
    }
    return false;
  }
);


//rangeSearch Proteins
$.fn.dataTable.ext.search.push(
  function(settings, data, dataIndex) {
    var min = parseInt($('#min-pro').val(), 10);
    var max = parseInt($('#max-pro').val(), 10);
    var noPro = parseFloat(data[3].split(" ")[1]) || 0;

    if ((isNaN(min) && isNaN(max)) ||
      (isNaN(min) && noPro <= max) ||
      (min <= noPro && isNaN(max)) ||
      (min <= noPro && noPro <= max)) {
      return true;
    }
    return false;
  }
);


//rangeSearch pVOGs
$.fn.dataTable.ext.search.push(
  function(settings, data, dataIndex) {
    var min = parseInt($('#min-vog').val(), 10);
    var max = parseInt($('#max-vog').val(), 10);
    if (data[4] == '0') {
      var nopVog = 0;
    } else {
      var nopVOG = parseFloat(data[4].split(" ")[1]) || 0;
    }  
    if ((isNaN(min) && isNaN(max)) ||
      (isNaN(min) && nopVOG <= max) ||
      (min <= nopVOG && isNaN(max)) ||
      (min <= nopVOG && nopVOG <= max)) {
      return true;
    }
    return false;
  }
);

$(document).ready(function() {

 $('input, .range').each(function() {
    this.value = '';
  });
  var flag = true;
  //display search boxes on click
  $('.rangeLink').click(function() {
    var $this = $(this);
    $('#rangeSearch').toggle();
    flag = !flag;
    if(flag) {
      $this.text("Hide Range Search");
    } else {
      $this.text("Show Range Search")
    }
  });

  var table = $('#example').DataTable({
    lengthMenu: [
      [10, 25, 50, -1],
      [10, 25, 50, "All"]
    ],
    select: true,
    dom: 'Blfrtip',
    buttons: [
      {
        extend: 'colvis',
        text: '<span class="">Show/Hide Columns</span>',
      },
      {
        extend: 'collection',
        text: 'Export options',
        buttons: [
         /** {
            extend: 'pdf',
	    orientation: 'landscape',
            text: 'pdf all'
          },
          {
            extend: 'pdf',
            text: 'pdf selected',
	    orientation: 'landscape',
            exportOptions: {
              modifier: {
                selected: true
              }
            }
          },**/
          {
            extend: 'copy',
            text: 'copy all'
          },
          {
            extend: 'copy',
            text: 'copy selected',
            exportOptions: {
              modifier: {
                selected: true
              }
            }
          },
          {
            extend: 'print',
            text: 'print all'
          },
          {
            extend: 'print',
            text: 'print selected',
	    title: 'Selected Genomes in Prokaryotic Virus Orthologous Groups Database',
            exportOptions: {
              modifier: {
                selected: true
              }
            }
          }, /**
          {
            extend: 'csv',
            text: 'csv all'
          },
          {
            extend: 'csv',
            text: 'csv selected',
            exportOptions: {
              modifier: {
                selected: true
              }
            }
          }, **/
          {
            extend: 'excel',
            text: 'excel all',
          },
          {
            extend: 'excel',
            text: 'excel selected',
	    title: 'Selected Genomes in Prokaryotic Virus Orthologous Groups Database',
            exportOptions: {
              modifier: {
                selected: true
              }
            }
          }
        ]
      }
    ],
    ajax: "./src/genomeJSON.txt",
    rowReorder : true,
    columnDefs : [
      {
        targets : 0,
        render : function(data) {
          var split = data.split("|");
          var name = split[0];
          var id = split[1];
          return '<a href="https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id='
            + id + '" target="_blank">' + name +' &#8599</a>';
        }
      },
      {
        targets : 1,
        render : function(data) {
          var split = data.split(",");
          var ans = "";
          if (split.length > 1) {
            for (var i = 0; i < split.length; i++) {
              ans = ans + '<a href="https://www.ncbi.nlm.nih.gov/nuccore/'
                + split[i] + '" target="_blank">' + split[i] + " &#8599" +'</a> </br>';
            }
            return ans;
          }
          return '<a href="https://www.ncbi.nlm.nih.gov/nuccore/'
            + data + '" target="_blank">' + data + " &#8599" +'</a>';
        }
      },
      {
        targets : 3,
        render : function(data) {
          return data.split("|")[0];
		//return '<a href="./proteintable.html#genomeAccession=' + data.split("|")[1] + '">&#8227 ' + data.split("|")[0] + ' </a>';
        }
      },
      {
        targets : 4,
        render : function(data) {
          if (data.split("|")[0] == '0') {
            return '0';
          } else {
            //DO NOT CHANGE THIS!
            //Spaces are set up so that it can be sorted
            //return '<a href="genomes/' + data.split("|")[1] + '.html">&#8227 ' + data.split("|")[0] + ' </a>';
            return '<a href="genomes/' + data.split("|")[1] + '.html">' + data.split("|")[0] + ' </a>';
	  }
        }
      },
      {
        targets : 8,
        render : function(data) {

          var phrases = data.split(" ");
          if (phrases[1] && phrases[2]) {
            return phrases[0] + "<br />" + phrases[1] + " " + phrases[2];
          } else {
            return data;
          }
        }
      },

    ],
/**
    //Customized sorting functions
   "aoColumns" : [
      null,
      null,
      null,
      {'sType' : 'protein'},
      {'sType' : 'vog'},
      null,
      null,
      null,
      null,
      null,
      null],
**/
    initComplete: function() {

      //column dropdown
      this.api().columns([6, 7, 8, 9, 10]).every(function() {
        var column = this;
        var selectFooter =
          $('<select class="shortSelect"><option value="">Show All</option><select>')
          .appendTo($(column.footer()).empty())
          .on('change', function() {
            var val = $.fn.dataTable.util.escapeRegex(
              $(this).val()
            );

            column
              .search(val ? '^' + val + '$' : '', true, true, false)
              .draw();
          });

        column.data().unique().sort().each(function(d, j) {
          selectFooter.append('<option value="' + d + '">' + d + '</option>');
        });
      });

      //search boxes
      this.api().columns([0, 1, 2, 3, 4, 5]).every(function() {
        var column = this;
        //first add the boxes
        //then apply the actual search
        var searchFooter =
          $('<input type="text" placeholder="Search"/>')
          .appendTo($(column.footer()))
          .on('keyup', function() {
            var val = $.fn.dataTable.util.escapeRegex(
              $(this).val()
            );
        column
          .search(val,false,true,true)
          .draw();
          });
      });
    }
  });

  table.buttons().container()
    .appendTo('#rangeSearchWrapper .col-sm-6:eq(0)');

  $('#min-genome, #max-genome').keyup(function() {
    table.draw();
  });

  $('#min-pro, #max-pro').keyup(function() {
    table.draw();
  });

  $('#min-vog, #max-vog').keyup(function() {
    table.draw();
  });

  $('#example tbody').on('click', 'tr', function() {
    $(this).toggleClass('selected');
  });
});

function getPro (proteins) {
  return  Number(proteins.split(" ")[2]);
}

jQuery.fn.dataTableExt.oSort["protein-desc"] = function(x, y) {
  return getPro(x) < getPro(y);
}

jQuery.fn.dataTableExt.oSort["protein-asc"] = function(x, y) {
  return getPro(x) > getPro(y);
}

// The following 3 are custom sortings for # of VOGs
function getNum (vogs) {
  if (vogs == '0') {
    return 0;
  } else {
    res = Number(vogs.split(" ")[2]);
    return res;
  }
};

jQuery.fn.dataTableExt.oSort["vog-desc"] = function(x, y) {
  return getNum(x) < getNum(y);
};

jQuery.fn.dataTableExt.oSort["vog-asc"] = function(x, y) {
  return getNum(x) > getNum(y);
};
