browser = (typeof browser !== 'undefined') ? browser : chrome;
var g_loaded = false;
var cur_webid = null;

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  var initialized = (DO!==undefined && DO.U!==undefined && g_loaded);
  try {
    if (request.action == "dokieli.status") {
      sendResponse({"dokieli":initialized});
    }
    else if (request.action == "dokieli.menu") {
      var iri = null;
      if (!g_loaded && !document.querySelector('#document-menu')) {
        var bodyAttributes = {
          "about": "",
          "prefix": "rdf: http://www.w3.org/1999/02/22-rdf-syntax-ns# rdfs: http://www.w3.org/2000/01/rdf-schema# owl: http://www.w3.org/2002/07/owl# xsd: http://www.w3.org/2001/XMLSchema# dcterms: http://purl.org/dc/terms/ dctypes: http://purl.org/dc/dcmitype/ foaf: http://xmlns.com/foaf/0.1/ pimspace: http://www.w3.org/ns/pim/space# cc: https://creativecommons.org/ns# skos: http://www.w3.org/2004/02/skos/core# prov: http://www.w3.org/ns/prov# qb: http://purl.org/linked-data/cube# schema: http://schema.org/ void: http://rdfs.org/ns/void# rsa: http://www.w3.org/ns/auth/rsa# cert: http://www.w3.org/ns/auth/cert# wgs: http://www.w3.org/2003/01/geo/wgs84_pos# bibo: http://purl.org/ontology/bibo/ sioc: http://rdfs.org/sioc/ns# doap: http://usefulinc.com/ns/doap# dbr: http://dbpedia.org/resource/ dbp: http://dbpedia.org/property/ sio: http://semanticscience.org/resource/ opmw: http://www.opmw.org/ontology/ deo: http://purl.org/spar/deo/ doco: http://purl.org/spar/doco/ cito: http://purl.org/spar/cito/ fabio: http://purl.org/spar/fabio/ oa: http://www.w3.org/ns/oa# as: https://www.w3.org/ns/activitystreams# ldp: http://www.w3.org/ns/ldp# solid: http://www.w3.org/ns/solid/terms# acl: http://www.w3.org/ns/auth/acl# dio: https://w3id.org/dio#",
          "typeof": "schema:CreativeWork sioc:Post prov:Entity schema:Article"
        }
        Object.keys(bodyAttributes).forEach(function(attribute){
          if(!document.body.getAttribute(attribute)){
            document.body.setAttribute(attribute, bodyAttributes[attribute]);
          }
        });

        DO.U.init();
        g_loaded = true;
      }

      if (request.webid) {
        try {
          var w = JSON.parse(request.webid);
          iri = w.id;
        }
        catch(e) {
          console.log("dokieli:"+e);
        }
      }

      if (iri && (cur_webid==null || cur_webid!=iri)) {
        DO.U.submitSignIn(iri);
        cur_webid = iri;
      }
      DO.U.showDocumentMenu();
    }
    else {
      sendResponse({}); /* stop */
    }
  }
  catch(e) {
    console.log("dokieli: onMsg="+e);
  }
});
