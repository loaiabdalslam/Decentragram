//https://picsum.photos/200/300?random=2

App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function () {
    return App.initWeb3();
  },

  initWeb3: function () {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta M

      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function () {
    $.getJSON("Decentragram.json", function (Decentragram) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Decentragram = TruffleContract(Decentragram);
      // Connect provider to interact with contract
      App.contracts.Decentragram.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function () {
    App.contracts.Decentragram.deployed().then(function (instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393

      /*
      instance.ImageCreated({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log(error)
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        //App.render();
      });
      
      instance.ImageTipped({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error,event){
        console.log(error)
        console.log('event triggerd',event)

      })
    });
    */
      instance.allEvents({ fromBlock: 'latest' }, function (error, event) {
        if (error) {
          console.log(error)
        } else {
          console.log("All Events")
          console.log(event);

          $("#exampleModal").modal('hide')
          $('#images').html('')
          App.render()


        }
      })
    })


  },

  render: function () {
    var DecentragramInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        window.ethereum.enable().then(function (account) {
          app = account
          App.account = app[0]
          $("#account_address").text(App.account)
          loader.hide();
          content.show();
          App.get_images();

        })
      }
    });
  },

  // Writting Setting Functions 
  //A) upload images
  uploadImage: function (_title, _desc) {
    App.contracts.Decentragram.deployed().then(function (instance) {
      instance.uploadImage("sha256", _title, _desc, { from: App.account })
    })
  },
  // B) TipImages images
  tipImageOwner: function (_id) {
    App.contracts.Decentragram.deployed().then(function (instance) {
      instance.tipImageOwner(_id, { from: App.account, value })
    })
  },

  //Writting Reading Function
  get_images: function () {
    _html = ``
    App.contracts.Decentragram.deployed().then(function (instance) {
      return instance.imageCount()
        .then(async function (imageCount) {
          imageCount = imageCount.toNumber()
          console.log('images count', imageCount)
          for (x = 1; x <= imageCount; x++) {
            image = await instance.images(x)
            _html = ` 
      <div class="card mx-auto custom-card mt-3 col-md-6" id="prova">
      <div class="row post-header col-12 py-2 px-3">
          <div class="col-6 float-left "><h4>${image[2]}</h4></div>
          <div class="col-6 float-right text-right post-number"><h4>12/14</h4></div>
      </div>
      <img class="card-img"  style="height: 600px;" src="https://picsum.photos/200/300?random=${image[0]}" alt="Card image cap">
      <div class="card-body px-3">
          <h5 class="card-title">${image[2]}</h5>
          <p class="card-text">Total Tip : ${image[4]} Eth</p>
          <p class="card-text">${image[3]}</p>
          <p class="card-text">From : ${image[5]} </p>

      </div>
       <div class="row post-header px-3 pb-3">
          <div class="col-1 float-left text-left"><i class="far fa-heart"></i></i></div>
          <div class="col-10 float-left text-left">Comment...</div>
          <div class="col-1 float-right text-right"><i class="fa fa-ellipsis-v" aria-hidden="true"></i></div>
      </div>       
  </div>
`
            console.log(image)
            $('#images').append(_html)
          }
          console.log(_html)

        })
    })
  }



};

$(function () {
  $(window).load(function () {
    App.init();
  });

  $("#publish").click(function(){
    var title = $("#title").val()
    var description = $("#description").val()
    App.uploadImage(title,description)

  })

});
