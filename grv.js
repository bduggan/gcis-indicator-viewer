
// settings
var server;
var report;

server = 'http://data.gcis-dev-front.joss.ucar.edu';
report = 'nca3';

$(main);

function main() {
    $('<a />',{ href : server, text : server} ).appendTo('#server');
    $.getJSON( server + '/report.json?report_type=indicator&all=1', function(d) {
        $(d).each(function(i,e) {
            var li = $('<a />', {
                text : e.title,
                class : 'list-group-item indicator',
                id :  e.identifier,
                click : show_indicator,
                href : e.href } );
            li.appendTo('#toplist');
        });
    });
}

var shown;
function show_indicator() {
    var href = $(this).attr('href');
    var id = $(this).attr('id');
    if (shown) {
        $('#' + shown ).toggleClass('active');
    }
    console.log('showing indicator', id);
    $('#' + id ).toggleClass('active');
    shown = id;
    $.get( href, function(d) {
        console.log('hi');
        $('#myModalLabel').html(d.title);
        $('#summary').css({'white-space':'pre-line'});
        $('#summary').html(d.summary);
        $('#files').html("");
        $('#figures').html("");
        $('#images').html("");
        $('#data').html("");
        $('#activities').html("");
        $(d.files).each(function(i,e) {
            var a = $('<a />', { href : e.href } );
            var div = $('<div />', { class : 'thumbnail'} );
            var img = $('<img />', { src : server + '/assets/' + e.thumbnail } );
            a.html(img);
            div.html(a);
            $('#files').append(div);
        });
        $(d.report_figures).each(function(i,e) {
            $.get(e.href, function(figure) {
                console.log('figure ',figure);
                $('#figures').html('<pre>' + JSON.stringify(figure,undefined,"  ") + "</pre>");
                $(figure.images).each(function(i,e) {
                    $('#images').html('<pre>' + JSON.stringify(e,undefined," ") + '</pre>' );
                    $.get( server + '/image/' + e.identifier + '.json' , function(img) {
                        $('#images').append("<pre>" + JSON.stringify(img.parents,"","  ") + "</pre>");
                        $(img.parents).each(function(i,e) {
                            $.get( server + e.url + '.json', function (dataset) {
                                $('#data').append('<pre>' + JSON.stringify(dataset,"","  ") + "</pre>");
                            } );
                            $.get( server + e.activity_uri + '.json', function (activity) {
                                $('#activities').append('<pre>' + JSON.stringify(activity,"","  ") + "</pre>");
                            } );
                        });
                    } );
                } );
            });
        });
        $('#myModal').modal();
    });
    return false;
};

