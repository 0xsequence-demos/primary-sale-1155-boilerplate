/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs").promises;
const path = require("path");
const { SequenceCollections } = require("@0xsequence/metadata");
const JOKERS_ARR = require("./src/newJokers.json");

const PROJECT_ID = 1520;
const COLLECTION_ID = 692;

const METADATA_URL = "https://dev-metadata.sequence.app";

// const PROJECT_ACCESS_KEY = "AQAAAAAAAAXwaDkRGvx3uULoaciJqnHjkA0";
// "AQAAAAAAAAXwJy3lIknnme2OgdonHHznHQU";

const JWT_ACCESS_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoiMHgyYzA3NWFkNzQ2ZDRhNzk2YmU2ZWY2ZDVkMDhhOWM2NTdiNDcwNGQwIiwiaWF0IjoxNzQxNzkxMjA2LCJwcm9qZWN0IjoxNTIwfQ.zJgHOom3W35LFsCb-fRjfJM9qWyvub7OM3QxwlR9djw";
// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoiMHgzNmZhZjQ5ZjNhNGJmZGEyZmRiY2M1NmQxNDJkY2JmMzAwZjg1MmYwIiwiaWF0IjoxNzQxNzgzODY2LCJwcm9qZWN0IjoxNTIwfQ.6IflBEmS2ULPlL2AfOcK03Gfk4w6xF8y0-25r55JHvQ";

const collectionsService = new SequenceCollections(
  METADATA_URL,
  JWT_ACCESS_KEY,
);

const createAsset = (tokenId) => {
  return collectionsService.createAsset({
    projectId: PROJECT_ID,
    asset: {
      id: Number(tokenId.slice(0, 10)),
      collectionId: COLLECTION_ID,
      tokenId,
      metadataField: "image",
    },
  });
};

// const generateToken = ({ tokenId, name, description, attributes }) => {
//   return collectionsService.createToken({
//     projectId: PROJECT_ID,
//     collectionId: COLLECTION_ID,
//     token: {
//       tokenId,
//       name,
//       description,
//       decimals: 0,
//       attributes,
//     },
//   });
// };

const uploadAsset = async (tokenID, filePath) => {
  console.log(tokenID, filePath);
  const absolutePath = path.resolve(filePath);
  const arrayBuffer = await fs.readFile(absolutePath);
  const blob = new Blob([arrayBuffer]);

  const formData = new FormData();
  formData.append("file", blob, path.basename(filePath));

  // Construct the endpoint URL
  const endpointURL = `${METADATA_URL}/projects/${PROJECT_ID}/collections/${COLLECTION_ID}/tokens/${tokenID}/upload/image`;

  try {
    // Use fetch to make the request
    const fetchResponse = await fetch(endpointURL, {
      method: "PUT",
      body: formData,
      headers: { Authorization: `Bearer ${JWT_ACCESS_KEY}` },
    });

    // Assuming the response is JSON
    const data = await fetchResponse.json();

    console.log("upload response", { data });

    return data;
  } catch (err) {
    console.log(err);
  }
};

const createAndUploadAsset = async ({
  tokenId,
  name,
  description,
  attributes,
  url: filePath,
}) => {
  try {
    const { token } = await collectionsService.createToken({
      projectId: PROJECT_ID,
      collectionId: COLLECTION_ID,
      token: {
        tokenId,
        name,
        description,
        decimals: 0,
        attributes,
      },
    });
    await createAsset(tokenId);
    await uploadAsset(token.tokenId, filePath);
  } catch (error) {
    console.error(`Failed to upload asset:`, error);
  }
};

const main = async () => {
  try {
    await Promise.all(
      JOKERS_ARR.map(({ name, url, rarity, cost, effect }, index) =>
        createAndUploadAsset({
          tokenId: String(index + 1),
          name,
          description: effect,
          url: `./public${url}`,
          attributes: [{ rarity, cost }],
        }),
      ),
    );
  } catch (error) {
    console.error("Error uploading assets:", error);
  }
};

main();
