package com.imperial.drp36.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "sources")
public class Source {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "segment_id", nullable = false)
  private Long segmentId;

  @Column(name = "title", nullable = false)
  private String title;

  @Column(name = "outlet_name", nullable = false)
  private String outletName;

  @Column(name = "outlet_shortcode", nullable = false)
  private String outletShortcode;

  @Column(name = "outlet_domain", nullable = false)
  private String outletDomain;

  @Column(name = "url", nullable = false)
  private String url;

  @Column(name = "tag")
  private String tag;

  // Constructors
  public Source() {}

  public Source(Long segmentId, String title, String outletName, String outletShortcode,
      String outletDomain, String url, String tag) {
    this.segmentId = segmentId;
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

  public Long getSegmentId() { return segmentId; }
  public void setSegmentId(Long segmentId) { this.segmentId = segmentId; }

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