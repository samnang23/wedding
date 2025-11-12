#!/usr/bin/env python3
import qrcode
import sys

def make_qr(data, out='qr.png', box_size=10, border=4):
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=box_size,
        border=border,
    )
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    img.save(out)
    print(f"Saved QR to {out}")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python make_qr.py 'text or url' [output.png]")
        sys.exit(1)
    data = sys.argv[1]
    out = sys.argv[2] if len(sys.argv) >= 3 else 'qr.png'
    make_qr(data, out)
