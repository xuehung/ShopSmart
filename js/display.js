var ProductBox = React.createClass({
    getInitialState: function() {
        return {data: []};
    },
    render: function() {
        return (
            <div className="product_box">
            <ProductList data={this.props.data} />
            </div>
        );
    }
});


var ProductList = React.createClass({
  render: function() {

    var commentNodes = this.props.data.map(function (comment) {
          return (
                  <Product data={comment}>
                  </Product>
                );
        });

      return (
          <div className="product_list">
          {commentNodes}
          </div>
          );
    }
});


var Product = React.createClass({
  render: function() {
      var mapId = "map-canvas-"+this.props.data.id;
      return (
            <div className="product">
                    <h3>
                        {this.props.data.product_name}
                    </h3>
                    <h4>
                        {this.props.data.location}
                    </h4>
                    <hr />
                <div className="row">
                <div className="col-xs-5">
                    <div>
                        <img className="product_img" src={this.props.data.img_url} />
                    </div>
                </div>
                <div className="col-xs-7">
                    <div id={mapId} className="product_map"></div>
                </div>
                </div>
                    <AttendeeListBox data={this.props.data.list} id={this.props.data.id}/>
            </div>
          );
    }
});

var AttendeeListBox = React.createClass({
    handleJoinSubmit: function(data) {
        display.join(data);
    },
    render: function() {
        return (
            <div>
            <hr />
            <AttendeeList data={this.props.data} />
            <hr />
            <JoinForm id={this.props.id} onJoinSubmit={this.handleJoinSubmit}/>
            </div>
        );
    }
});

var AttendeeList = React.createClass({
    render: function() {
        var nodes = this.props.data.map(function (attendee) {
          return (
                  <Attendee data={attendee} />
                );
        });
      return (
          <div id="attendee_list" data-columns>
          {nodes}
          </div>
          );
    }
});

var Attendee = React.createClass({
    render: function() {
        return (
            <div className="row">
                <div className="col-xs-6">
                    {this.props.data.name}
                </div>
                <div className="col-xs-6">
                    {this.props.data.contact}
                </div>
            </div>
        );
    }
});

var JoinForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        var id = this.refs.id.getDOMNode().value
        //var author = this.refs.author.getDOMNode().value.trim();
        //var text = this.refs.text.getDOMNode().value.trim();
        var author = User.name;
        var text = User.email;
        if (!text || !author) {
              return;
        }
        this.props.onJoinSubmit({id: id, name: author, contact: text});
        //this.refs.author.getDOMNode().value = '';
        //this.refs.text.getDOMNode().value = '';
        return;
    },
    render: function() {
        return (
            <form className="JoinForm" onSubmit={this.handleSubmit}>
            <input type="hidden" value={this.props.id}  ref="id" />
            <button type="submit" className="btn btn-primary">Join</button>
            </form>
        );
    }
});

var display = {
    /*
    products: [
        {
            id: 1,
            product_name: "Kirkland Signature Orange Juice",
            location: "",
            location_lat: 100,
            location_lon: 100,
            unit: 5,
            unit_price: 20,
            img_url: "http://content.costco.com/Images/Content/Product/505483_editb.jpg",
            list: [
                {
                    name: "Mike",
                    contact: "xuehung@gmail.com"
                }
            ]
        },
        {
            id: 2,
            product_name: "Maxwell House Regular Ground",
            location: "",
            location_lat: 100,
            location_lon: 100,
            unit: 5,
            unit_price: 20,
            img_url: "http://content.costco.com/Images/Content/Product/117066b.jpg",
            list: [
                {
                    name: "Mike",
                    contact: "xuehung@gmail.com"
                }
            ]
        },
        {
            id: 3,
            product_name: "Tree Top 100% Apple Juice",
            location: "",
            location_lat: 100,
            location_lon: 100,
            unit: 5,
            unit_price: 20,
            img_url: "http://content.costco.com/Images/Content/Product/591b.jpg",
            list: [
                {
                    name: "Mike",
                    contact: "xuehung@gmail.com"
                }
            ]
        },
        {
            id: 4,
            product_name: "Starbucks House Blend Coffee",
            location: "",
            location_lat: 100,
            location_lon: 100,
            unit: 5,
            unit_price: 20,
            img_url: "http://content.costco.com/Images/Content/Product/888755b.jpg",
            list: [
                {
                    name: "Mike",
                    contact: "xuehung@gmail.com"
                }
            ]
        },
    ],
    */


    update: function() {
        React.render(
            <ProductBox data={this.products}/>,
            document.getElementById('content')
        );

        var $container = $('#product_list');
        // init
        $container.isotope({
            // options
            itemSelector: '.item',
            layoutMode: 'fitRows'
        });

        this.products.forEach(function(e){
            var mapId = "map-canvas-" + e.id;
            console.log(mapId);
            planner.newMap(mapId, e.lat, e.lng);
        });
    },

    join: function(data) {
        var id = data.id;
        var name = data.name;
        var contact = data.contact;
        /*
        for (var i = 0 ; i < this.products.length ; i++) {
            var element = this.products[i];
            if (element.id == id) {
                element.list.push({
                    name: name,
                    contact: contact
                });
                display.update();
                break;
            }
        }
       */
        var newJoin = {
            id: id,
            name: name,
            contact: contact,
            type: "join"
        }
        $.ajax({
            url: SERVER_URL+"/data.json",
            dataType: 'json',
            type: 'POST',
            data: newJoin,
            success: function(data) {
                getData(function(data){
                    display.products = data;
                    display.update();
                });
            }
        });
    },

    getNextId() {
        var max = -1;
        display.products.forEach(function(p){
            if(p.id > max) max = p.id;
        });
        return max + 1;
    },

    insertProduct: function(name, url) {
        var id = display.getNextId();
        /*
        display.products.unshift({
            id: id,
            product_name: name,
            img_url: url,
            list: []
        });
       */
      var location = $("#np_location").val();
      var lat = $("#np_location_lat").val();
      var lng = $("#np_location_lng").val();
        var newProduct = {
            id: id,
            product_name: name,
            img_url: url,
            list: [],
            location: location,
            lat: lat,
            lng: lng
        }
        $.ajax({
            url: SERVER_URL+"/data.json",
            dataType: 'json',
            type: 'POST',
            data: newProduct,
            success: function(data) {
                getData(function(data){
                    display.products = data;
                    display.update();
                });
            }
        });
        }
    };


getData(function(data){
    display.products = data;
    display.update();
});

