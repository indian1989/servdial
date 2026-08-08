import { useState } from "react";
import {
  Share2,
  Copy,
  Check
} from "lucide-react";


const ShareMenu = ({ business, open, onClose }) => {

  const [copied, setCopied] = useState(false)
  if (!open) return null;
  const shareUrl = window.location.href;

  const copyLink = async () => {

    await navigator.clipboard.writeText(shareUrl);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);

  };


  const nativeShare = async () => {

    if (navigator.share) {

      await navigator.share({

        title: business?.name,

        text:
        `Check this business on ServDial - ${business?.name}`,

        url: shareUrl

      });

    }

    else {

      copyLink();

    }

  };



  const whatsappShare = () => {

    const text =
    `Check ${business?.name} on ServDial\n${shareUrl}`;


    window.open(

      `https://wa.me/?text=${encodeURIComponent(text)}`,

      "_blank"

    );

  };



  const facebookShare = () => {

    window.open(

      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,

      "_blank"

    );

  };


return (

<div
className="
fixed
inset-0
bg-black/40
flex
items-center
justify-center
z-[200]
px-4
"
>

<div
className="
bg-white
rounded-xl
shadow-xl
p-5
w-full
max-w-md
"
>


<div className="flex justify-between items-center mb-4">

<div className="flex items-center gap-2">

<Share2
size={20}
className="text-blue-600"
/>

<h3 className="font-semibold">
Share Business
</h3>

</div>


<button
onClick={onClose}
className="text-gray-500"
>
✕
</button>


</div>


<div className="flex flex-wrap gap-3">


<button

onClick={nativeShare}

className="
bg-blue-600
text-white
px-4
py-2
rounded-lg
text-sm
"

>

Share

</button>



<button

onClick={whatsappShare}

className="
bg-green-600
text-white
px-4
py-2
rounded-lg
text-sm
"

>

WhatsApp

</button>



<button

onClick={facebookShare}

className="
bg-blue-800
text-white
px-4
py-2
rounded-lg
text-sm
"

>

Facebook

</button>



<button

onClick={copyLink}

className="
border
px-4
py-2
rounded-lg
text-sm
flex
items-center
gap-2
"

>

{
copied
?
<>
<Check size={15}/>
Copied
</>
:
<>
<Copy size={15}/>
Copy Link
</>
}


</button>


</div>
</div>

</div>

);


};


export default ShareMenu;