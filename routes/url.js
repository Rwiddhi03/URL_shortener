const express = require("express");
const shortid = require("shortid");
const URL = require("../models/url");

const router = express.Router();

router.post("/", async (req, res) => {
  const body = req.body;
  if (!body.url) {
    return res.status(400).send("❌ No URL provided.");
  }

  let redirectURL = body.url;
  if (!redirectURL.startsWith("http://") && !redirectURL.startsWith("https://")) {
    redirectURL = "https://" + redirectURL;
  }

  const shortId = shortid.generate();
  await URL.create({
    shortId,
    redirectURL,
    visitHistory: [],
  });

  return res.render("home" , {
    id: shortId
  })
});


// GET route to redirect to original URL
router.get("/:shortid", async (req, res) => {
  const shortid = req.params.shortid.trim();
  console.log("👉 Requested Short ID:", shortid);

  try {
    const entry = await URL.findOneAndUpdate(
      { shortId: shortid },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      },
      { new: true }
    );

    if (!entry) {
      console.log("❌ No entry found for:", shortid);
      return res.status(404).send("❌ Short URL not found");
    }

    // ✅ Ensure redirectURL starts with http:// or https://
    let redirectTo = entry.redirectURL;
    if (!redirectTo.startsWith("http://") && !redirectTo.startsWith("https://")) {
      redirectTo = "https://" + redirectTo;
    }

    console.log("✅ Redirecting to:", redirectTo);
    return res.redirect(redirectTo);

  } catch (error) {
    console.error("⚠️ Redirect error:", error);
    return res.status(500).send("⚠️ Internal Server Error");
  }
});

router.get('/analytics/:shortid', async(req, res)=>{
  const shortid = req.params.shortid.trim();
  const result = await URL.findOne({shortId : shortid})
  return res.send(`total clicks: ${result.visitHistory.length}`)
})


module.exports = router;