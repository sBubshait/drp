package com.imperial.drp36.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Source information for a segment")
public class SourceContent {
  @Schema(description = "Source ID", example = "1")
  private Long id;

  @Schema(description = "Source title", example = "Climate Change Report Shows Accelerating Global Warming Trends")
  private String title;

  @Schema(description = "Outlet name", example = "BBC News")
  private String outletName;

  @Schema(description = "Outlet shortcode", example = "BBC")
  private String outletShortcode;

  @Schema(description = "Outlet domain", example = "bbc.co.uk")
  private String outletDomain;

  @Schema(description = "Source URL", example = "https://www.bbc.co.uk/news/science-environment-12345678")
  private String url;

  @Schema(description = "Source tag", example = "News Source")
  private String tag;

  // Constructors
  public SourceContent() {}

  public SourceContent(Long id, String title, String outletName, String outletShortcode,
      String outletDomain, String url, String tag) {
    this.id = id;
    this.title = title;
    this.outletName = outletName;
    this.outletShortcode = outletShortcode;
    this.outletDomain = outletDomain;
    this.url = url;
    this.tag = tag;
  }

  // Getters and Setters
  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }

  public String getOutletName() { return outletName; }
  public void setOutletName(String outletName) { this.outletName = outletName; }

  public String getOutletShortcode() { return outletShortcode; }
  public void setOutletShortcode(String outletShortcode) { this.outletShortcode = outletShortcode; }

  public String getOutletDomain() { return outletDomain; }
  public void setOutletDomain(String outletDomain) { this.outletDomain = outletDomain; }

  public String getUrl() { return url; }
  public void setUrl(String url) { this.url = url; }

  public String getTag() { return tag; }
  public void setTag(String tag) { this.tag = tag; }
}