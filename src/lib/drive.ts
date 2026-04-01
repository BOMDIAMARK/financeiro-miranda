import { google } from "googleapis";
import { getAuthedClient } from "./google-auth";
import { Readable } from "stream";

const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

async function getDriveClient() {
  const auth = await getAuthedClient();
  return google.drive({ version: "v3", auth });
}

export async function uploadReceiptToDrive(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<{ id: string; webViewLink: string }> {
  const drive = await getDriveClient();

  const fileMetadata: { name: string; parents?: string[] } = {
    name: `comprovante_${Date.now()}_${fileName}`,
  };

  if (FOLDER_ID) {
    fileMetadata.parents = [FOLDER_ID];
  }

  const media = {
    mimeType,
    body: Readable.from(fileBuffer),
  };

  const res = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: "id, webViewLink",
  });

  // Make file viewable by anyone with the link
  await drive.permissions.create({
    fileId: res.data.id!,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  });

  return {
    id: res.data.id!,
    webViewLink: res.data.webViewLink || `https://drive.google.com/file/d/${res.data.id}/view`,
  };
}

export async function createDriveFolder(folderName: string): Promise<string> {
  const drive = await getDriveClient();

  const res = await drive.files.create({
    requestBody: {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
    },
    fields: "id",
  });

  return res.data.id!;
}
