# Modal.com async PDF generation function (WeasyPrint)
from modal import stub, web_endpoint
from weasyprint import HTML
from jinja2 import Template
import supabase

@stub.function(image="python:3.10")
@web_endpoint(method="POST")
def generate_pdf(data: dict):
    # Render HTML from template (assume template string or file)
    html = Template(open("user_manual.html").read()).render(**data)
    pdf = HTML(string=html).write_pdf()
    # Upload to Supabase Storage (pseudo-code, replace with actual client logic)
    url = supabase.storage.from_("reports").upload(f"{data['user_id']}.pdf", pdf)
    return {"status": "success", "url": url}

