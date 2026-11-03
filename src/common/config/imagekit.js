import ImageKit  from "@imagekit/nodejs";

const imageKit=new ImageKit({
publicKey:process.env.IMAGEKIT_PUBLIC_KEY,
privateKey:process.env.IMAGE_KIT_PRIVATE_KEY,
urlEndpoint:process.env.IMAGE_KIT_URL_ENDPOINT

})

export default imageKit;