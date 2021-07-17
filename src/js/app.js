App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
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

  initContract: function() {
    $.getJSON("Decentragram.json", function(Decentragram) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Decentragram = TruffleContract(Decentragram);
      // Connect provider to interact with contract
      App.contracts.Decentragram.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.Decentragram.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.ImageCreated({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log(error)
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
      
      instance.ImageTipped({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error,event){
        console.log(error)
        console.log('event triggerd',event)

      })
    });
  },

  render: function() {
    console.log("we are here ")
    var DecentragramInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();
    console.log("we are here ")

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        window.ethereum.enable().then(function(account){
          app=account
          App.account = app[0]
          $("#account_address").text(App.account)
        
        })
      }
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
