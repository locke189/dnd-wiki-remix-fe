export type TImage = {
  charset: null | string;
  created_on: string;
  description: null | string;
  duration: null | string;
  embed: null | string;
  filename_disk: string;
  filename_download: string;
  filesize: number;
  focal_point_x: null | string;
  focal_point_y: null | string;
  folder: string;
  height: number;
  id: string;
  location: null | string;
  metadata: Record<string, unknown>;
  modified_by: null | string;
  modified_on: string;
  storage: string;
  tags: null | string[];
  title: string;
  tus_data: null | string;
  tus_id: null | string;
  type: string;
  uploaded_by: string;
  uploaded_on: string;
  width: number;
  src?: string;
};
