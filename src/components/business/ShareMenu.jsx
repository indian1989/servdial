import { useState } from "react";
import {
  Share2,
  Copy,
  Check,
  MessageCircle,
  Facebook,
  Send,
  Linkedin,
  Mail,
  Smartphone,
} from "lucide-react";

const ShareMenu = ({ business, blog, open, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const shareUrl = blog
  ? `${window.location.origin}/blog/${blog?.slug || ""}`
  : `${window.location.origin}/${
      business?.citySlug ||
      business?.cityId?.slug ||
      ""
    }/${
      business?.categorySlug ||
      business?.categoryId?.slug ||
      ""
    }/${business?.slug || ""}`;

  const shareName = blog
  ? blog?.title || "this article"
  : business?.name || "this business";

  // =========================================================
  // COPY LINK
  // =========================================================

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("❌ Copy link failed:", error);
    }
  };

  // =========================================================
  // NATIVE SHARE
  // =========================================================

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareName,
          text: `Check this business on ServDial - ${shareName}`,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled native share
        if (error?.name !== "AbortError") {
          console.error("❌ Native share failed:", error);
        }
      }
    } else {
      copyLink();
    }
  };

  // =========================================================
  // WHATSAPP
  // =========================================================

  const whatsappShare = () => {
    const text =
      `Check ${shareName} on ServDial\n${shareUrl}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =========================================================
  // FACEBOOK
  // =========================================================

  const facebookShare = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =========================================================
  // TELEGRAM
  // =========================================================

  const telegramShare = () => {
    const text =
      `Check ${shareName} on ServDial`;

    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =========================================================
  // LINKEDIN
  // =========================================================

  const linkedinShare = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =========================================================
  // EMAIL
  // =========================================================

  const emailShare = () => {
    const subject =
      `Check ${shareName} on ServDial`;

    const body =
      `I found this business on ServDial:\n\n${shareName}\n${shareUrl}`;

    window.location.href =
      `mailto:?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
  };

  // =========================================================
  // SMS
  // =========================================================

  const smsShare = () => {
    const text =
      `Check ${shareName} on ServDial: ${shareUrl}`;

    window.location.href =
      `sms:?body=${encodeURIComponent(text)}`;
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      className="
        fixed
        inset-0
        z-[200]

        bg-black/50
        backdrop-blur-sm

        flex
        items-center
        justify-center

        px-4
      "
      onClick={onClose}
    >
      <div
        className="
          bg-white
          rounded-2xl
          shadow-2xl

          p-5
          sm:p-6

          w-full
          max-w-md
        "
        onClick={(e) => e.stopPropagation()}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            flex
            justify-between
            items-center
            mb-5
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <div
              className="
                w-10
                h-10
                rounded-full

                bg-blue-100
                text-blue-600

                flex
                items-center
                justify-center
              "
            >
              <Share2 size={20} />
            </div>

            <div>
              <h3
                className="
                  font-semibold
                  text-gray-900
                "
              >
                {blog ? "Share Article" : "Share Business"}
              </h3>

              <p
                className="
                  text-xs
                  text-gray-500
                  mt-0.5
                "
              >
                {blog
                  ? "Share this article with others"
                  : "Share this business with others"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close share menu"
            className="
              w-9
              h-9
              rounded-full

              flex
              items-center
              justify-center

              text-gray-500

              hover:bg-gray-100
              hover:text-gray-700

              transition
            "
          >
            ✕
          </button>
        </div>


        {/* =================================================
            BUSINESS NAME
        ================================================= */}

        <div
          className="
            mb-5
            px-3
            py-2.5

            bg-gray-50
            rounded-xl

            text-sm
            text-gray-700
            font-medium

            truncate
          "
        >
          {shareName}
        </div>


        {/* =================================================
            SHARE OPTIONS
        ================================================= */}

        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-4

            gap-3
          "
        >

          {/* SHARE */}

          <button
            type="button"
            onClick={nativeShare}
            className="
              flex
              flex-col
              items-center
              justify-center
              gap-2

              p-3

              rounded-xl
              border
              border-gray-200

              bg-blue-50
              text-blue-600

              hover:bg-blue-100
              hover:border-blue-300

              transition
            "
          >
            <Share2 size={20} />

            <span className="text-xs font-medium">
              Share
            </span>
          </button>


          {/* WHATSAPP */}

          <button
            type="button"
            onClick={whatsappShare}
            className="
              flex
              flex-col
              items-center
              justify-center
              gap-2

              p-3

              rounded-xl
              border
              border-gray-200

              bg-green-50
              text-green-600

              hover:bg-green-100
              hover:border-green-300

              transition
            "
          >
            <MessageCircle size={20} />

            <span className="text-xs font-medium">
              WhatsApp
            </span>
          </button>


          {/* FACEBOOK */}

          <button
            type="button"
            onClick={facebookShare}
            className="
              flex
              flex-col
              items-center
              justify-center
              gap-2

              p-3

              rounded-xl
              border
              border-gray-200

              bg-blue-50
              text-blue-700

              hover:bg-blue-100
              hover:border-blue-300

              transition
            "
          >
            <Facebook size={20} />

            <span className="text-xs font-medium">
              Facebook
            </span>
          </button>


          {/* TELEGRAM */}

          <button
            type="button"
            onClick={telegramShare}
            className="
              flex
              flex-col
              items-center
              justify-center
              gap-2

              p-3

              rounded-xl
              border
              border-gray-200

              bg-sky-50
              text-sky-600

              hover:bg-sky-100
              hover:border-sky-300

              transition
            "
          >
            <Send size={20} />

            <span className="text-xs font-medium">
              Telegram
            </span>
          </button>


          {/* LINKEDIN */}

          <button
            type="button"
            onClick={linkedinShare}
            className="
              flex
              flex-col
              items-center
              justify-center
              gap-2

              p-3

              rounded-xl
              border
              border-gray-200

              bg-indigo-50
              text-indigo-700

              hover:bg-indigo-100
              hover:border-indigo-300

              transition
            "
          >
            <Linkedin size={20} />

            <span className="text-xs font-medium">
              LinkedIn
            </span>
          </button>


          {/* EMAIL */}

          <button
            type="button"
            onClick={emailShare}
            className="
              flex
              flex-col
              items-center
              justify-center
              gap-2

              p-3

              rounded-xl
              border
              border-gray-200

              bg-gray-50
              text-gray-700

              hover:bg-gray-100
              hover:border-gray-300

              transition
            "
          >
            <Mail size={20} />

            <span className="text-xs font-medium">
              Email
            </span>
          </button>


          {/* SMS */}

          <button
            type="button"
            onClick={smsShare}
            className="
              flex
              flex-col
              items-center
              justify-center
              gap-2

              p-3

              rounded-xl
              border
              border-gray-200

              bg-purple-50
              text-purple-600

              hover:bg-purple-100
              hover:border-purple-300

              transition
            "
          >
            <Smartphone size={20} />

            <span className="text-xs font-medium">
              SMS
            </span>
          </button>


          {/* COPY LINK */}

          <button
            type="button"
            onClick={copyLink}
            className="
              flex
              flex-col
              items-center
              justify-center
              gap-2

              p-3

              rounded-xl
              border
              border-gray-200

              bg-gray-50
              text-gray-700

              hover:bg-gray-100
              hover:border-gray-300

              transition
            "
          >
            {copied ? (
              <Check
                size={20}
                className="text-green-600"
              />
            ) : (
              <Copy size={20} />
            )}

            <span className="text-xs font-medium">
              {copied ? "Copied" : "Copy Link"}
            </span>
          </button>

        </div>


        {/* =================================================
            CLOSE
        ================================================= */}

        <button
          type="button"
          onClick={onClose}
          className="
            w-full
            mt-5

            py-3

            rounded-xl

            bg-gray-100
            hover:bg-gray-200

            text-gray-700
            font-medium

            transition
          "
        >
          Close
        </button>

      </div>
    </div>
  );
};

export default ShareMenu;