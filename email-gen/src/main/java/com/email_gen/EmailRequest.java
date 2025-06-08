package com.email_gen;

import lombok.Data;

@Data // generate getter setter constructor
public class EmailRequest {
    private String emailContent;
    private String tone;
}
