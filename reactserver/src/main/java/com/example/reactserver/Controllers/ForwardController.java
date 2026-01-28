package com.example.reactserver.Controllers;

// Imports 
// ===============================================================================================================================================
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

// Class 
// ===============================================================================================================================================
@Controller
public class ForwardController {

    @GetMapping(value = {
            "/",
            "/{path:[^\\.]*}",
            "/**/{path:[^\\.]*}"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
