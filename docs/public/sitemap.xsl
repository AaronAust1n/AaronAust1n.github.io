<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
          }
          h1 {
            font-size: 2em;
            margin-bottom: 0.5em;
            color: #2c3e50;
          }
          .intro {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          table {
            width: 100%;
            border-collapse: collapse;
            background: #fff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          th {
            background: #3498db;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
          }
          td {
            padding: 12px;
            border-bottom: 1px solid #ecf0f1;
          }
          tr:hover {
            background: #f8f9fa;
          }
          a {
            color: #3498db;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          .url-count {
            color: #7f8c8d;
            font-size: 0.9em;
          }
        </style>
      </head>
      <body>
        <div class="intro">
          <h1>XML Sitemap</h1>
          <p class="url-count">
            This sitemap contains <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong> URLs.
          </p>
        </div>
        <table>
          <thead>
            <tr>
              <th>URL</th>
              <th>Alternate Links</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="sitemap:urlset/sitemap:url">
              <tr>
                <td>
                  <a href="{sitemap:loc}">
                    <xsl:value-of select="sitemap:loc"/>
                  </a>
                </td>
                <td>
                  <xsl:for-each select="*[local-name()='link']">
                    <span style="margin-right: 10px;">
                      <xsl:value-of select="@hreflang"/>
                    </span>
                  </xsl:for-each>
                </td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
