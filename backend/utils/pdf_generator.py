from fpdf import FPDF
import os

class IDGenerator(FPDF):
    def header(self):
        self.set_fill_color(0, 45, 26) # Deep Green
        self.rect(0, 0, 210, 40, 'F')
        self.set_font('Arial', 'B', 20)
        self.set_text_color(0, 255, 136) # Emerald
        self.cell(0, 20, 'MPSC IT CLUB', 0, 1, 'C')
        self.set_font('Arial', 'I', 10)
        self.cell(0, 10, 'Official Membership Card', 0, 1, 'C')

def generate_membership_pdf(user_data, qr_path, output_path):
    pdf = IDGenerator()
    pdf.add_page()
    
    # User Info
    pdf.set_y(60)
    pdf.set_font('Arial', 'B', 14)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 10, f"Name: {user_data['full_name']}", 0, 1)
    pdf.cell(0, 10, f"ID: {user_data['member_id']}", 0, 1)
    pdf.cell(0, 10, f"Class: {user_data['class']}", 0, 1)
    pdf.cell(0, 10, f"Joined: {user_data['join_date']}", 0, 1)
    
    # Add QR Code
    if os.path.exists(qr_path):
        pdf.image(qr_path, x=150, y=60, w=40)
    
    pdf.output(output_path)
    return output_path
