import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useMemo } from "react";
import tinymce from "tinymce/tinymce";
import "tinymce/icons/default";
import "tinymce/models/dom";
import "tinymce/themes/silver";
import "tinymce/skins/ui/oxide/skin.min.css";
import "tinymce/plugins/table";
import "tinymce/plugins/lists";
import "tinymce/plugins/code";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/autoresize";
import "tinymce/plugins/help";

const REPORT_EDITOR_HOST_STYLES = `

.report-template-editor .tox.tox-tinymce {
  width: 100% !important;
  max-width: 100% !important;
}

.report-template-editor .tox.tox-tinymce-inline {
  width: 100% !important;
}
`;

const REPORT_EDITOR_CONTENT_STYLES = `

:root {
  font-family: Arial, sans-serif;
  font-size: 8pt;
}

body {
  font-family: Arial, sans-serif;
  font-size: 8pt;
}

h1 {
  color: #000000;
  font-size: 1.5em;
  text-align: center;
}

h2 {
  color: #000000;
  font-size: 1.2em;
  text-align: center;
}

table {
  width: 100%;
  max-width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #181717;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #3399ff;
  color: #ffffff !important;
}

tr:nth-child(even) {
  background-color: #e7e7e7;
}
`;

function TemplateEditor({ model = "", onModelChange = () => {} }) {
  useEffect(() => {
    const styleId = "report-editor-preview-styles";
    if (document.getElementById(styleId)) return;

    const styleElement = document.createElement("style");
    styleElement.id = styleId;
    styleElement.innerHTML = REPORT_EDITOR_HOST_STYLES;
    document.head.appendChild(styleElement);
  }, []);

  const config = useMemo(
    () => ({
      license_key: "gpl",
      width: "100%",
      min_height: 700,
      menubar: false,
      branding: false,
      promotion: false,
      plugins: "table lists code fullscreen autoresize help",
      toolbar:
        "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table hr | code fullscreen help",
      block_formats:
        "Normal=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Code=pre",
      font_family_formats:
        "Arial=arial,helvetica,sans-serif; Georgia=georgia,serif; Times New Roman='Times New Roman',times,serif; Verdana=verdana,geneva,sans-serif",
      fontsize_formats: "8px 10px 12px 14px 18px 24px 36px",
      content_style: REPORT_EDITOR_CONTENT_STYLES,
      autoresize_min_height: 700,
      autoresize_bottom_margin: 16,
      verify_html: false,
      valid_elements: "*[*]",
      extended_valid_elements:
        "colgroup,col,col[style|width|span],table[style|border|width|cellspacing|cellpadding],tbody,thead,tfoot,tr,td[style|colspan|rowspan|width|height],th[style|colspan|rowspan|width|height]",
    }),
    [],
  );

  return (
    <div className="report-template-editor">
      <Editor
        tinymce={tinymce}
        init={config}
        value={model}
        onEditorChange={onModelChange}
      />
    </div>
  );
}

export default TemplateEditor;
