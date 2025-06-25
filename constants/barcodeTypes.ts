export const BARCODE_TYPES = {
  QR: 'qr',
  CODE128: 'code128',
  CODE39: 'code39',
  CODE93: 'code93',
  EAN13: 'ean13',
  EAN8: 'ean8',
  UPC_E: 'upc_e',
  DATAMATRIX: 'datamatrix',
  ITF14: 'itf14',
  PDF417: 'pdf417',
};

export const SCAN_MODES = {
  QR_CODE: 'QR-Code',
  EAR_TAG: 'Tierohrmarke',
};

// Note: We're not using this directly in the CameraView component anymore
// Instead, we're hardcoding the string values in the component
export const MODE_TO_BARCODE_TYPES = {
  [SCAN_MODES.QR_CODE]: [BARCODE_TYPES.QR],
  [SCAN_MODES.EAR_TAG]: [
    BARCODE_TYPES.CODE128,
    BARCODE_TYPES.CODE39,
    BARCODE_TYPES.CODE93,
    BARCODE_TYPES.EAN13,
    BARCODE_TYPES.EAN8,
    BARCODE_TYPES.UPC_E,
    BARCODE_TYPES.DATAMATRIX,
    BARCODE_TYPES.ITF14,
    BARCODE_TYPES.PDF417,
  ],
};