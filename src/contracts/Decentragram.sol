pragma solidity >=0.4.22 <0.8.0;

contract Decentragram {

string public name = "Decentragram";
uint public imageCount = 0;


struct Image {
  uint id;
  string hash;
  string desc;
  uint tipAmount;
  address payable author;
  
}

//store images
mapping(uint =>Image) public images; 

event ImageCreated (
  uint id,
  string hash,
  string desc,
  uint tipAmount,
  address payable author
);

event ImageTipped (
  uint id,
  string hash,
  string desc,
  uint tipAmount,
  address payable author
);

function uploadImage(string memory _img_hash,string memory _desc) public {
  //requirements
  require(bytes(_img_hash).length > 0  ,'please upload not a blank image');
  require(bytes(_desc).length  > 0 ,'please write description for image');
  require(msg.sender != address(0x0));



  imageCount = imageCount++;
  images[imageCount] = Image(imageCount,_img_hash,_desc,0,msg.sender);
  emit ImageCreated(imageCount,_img_hash,_desc,0,msg.sender);


}
  
// tip images

function tipImage (uint memory _id )public payable {
  Image memory image_ = images[_id];
  address payable _author = image_.author
  address(_author).transfer(msg.value)
  _image.tipAmount =  _image.tipAmount += msg.value
  images[_id] = _image
  ImageTipped(_id,_image.hash,_image.desc,_image.tipAmount,_author)

}



}