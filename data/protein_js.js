function getHash(key) {
  var match = location.hash.match(new RegExp(key+'=([^&]*)'));
  return match ? match[1] : "";
}
//get the prefilter element
var hash = getHash('genomeAccession');

$(document).ready(function() {

  var table =  $('#example').DataTable({
    ajax: './src/proteinJSON.txt',

		initComplete: function() {

      var counter = 0;
			this.api().columns().every(function () {
        counter = counter + 1;
				var column = this;
				var searchFooter =
					$('<input id="column_filter_' + counter + '" type="text" placeholder="search"/>')
						.appendTo($(column.footer()))
						.on('keyup', function() {
							var val = $.fn.dataTable.util.escapeRegex(
								$(this).val()
							);
							column
								.search(val, false, true, true)
								.draw();
						});
			});
      $('#example_filter input').val(hash);
      this.api().search(hash).draw();
		}
 });
  if (hash != "") {
    $('<p> You are searching for all the proteins that the genome with Genome Accession : ' + hash + ' has <p>').appendTo('#example_length');
  }
});
