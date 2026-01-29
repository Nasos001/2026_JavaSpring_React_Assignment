package com.example.reactserver.Controllers;

// Imports 
// ===============================================================================================================================================
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

// Class
// ===============================================================================================================================================
@RestController
public class SpaController {

    // Get Index.html
    // ----------------------------------------------------------------------------------------------------------------
    @GetMapping(value = { "/", "/{path:(?!api|assets).*}/**" }, produces = MediaType.TEXT_HTML_VALUE)
    public String serveIndex() throws IOException {
        Resource resource = new ClassPathResource("static/index.html");
        return StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
    }
}