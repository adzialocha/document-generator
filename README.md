# document-generator

Generate your .pdf invoices, letters, documents, etc. with templates based on [YAML](https://yaml.org/), [HTML](https://dev.w3.org/html5/html-author/) & [SCSS](https://sass-lang.com).

## Features

* Separates the document content from its form
* Templates and contents can easily be combined with version control systems
* Reads the actual content in simple YAML syntax
* Generates documents layouted and styled via HTML and SCSS (with variables, @import statements, etc.)
* Offers filters, inheritance, loops etc. in HTML templates via [Nunjucks](https://mozilla.github.io/nunjucks/)
* Organizes multiple templates and *flavours* for template variants (for example different languages of one document)
* Generates .pdf files via [wkhtmltopdf](https://wkhtmltopdf.org/)

## Install

It is recommended to install `document-generator` globally via `npm`:

    npm install -g document-generator

## Usage

```
Usage: document-generator [options] <file>

Generate your .pdf invoices, letters, documents, etc. with templates based on YAML, HTML & SCSS

Options:
  -V, --version          output the version number
  -s, --source <path>    path to source folder, defaults to "~/.document-templates" (default: "~/.document-templates")
  -o, --output <path>    output .pdf file path, defaults to "./<YYYYMMDD>-<templateName>.pdf"
  -n, --name <name>      add an optional name to the generated pdf file name. Works only when default output name is being used
  -t, --template <name>  template name, defaults to "invoice" (default: "invoice")
  -f, --flavour <name>   flavour name, defaults to "default" (default: "default")
  -h, --help             output usage information
```

## Example

This is a small tutorial on how to maintain your own document templates and how to use `document-generator`.

1. By default `document-generator` looks into `~/.document-templates/` for your templates (change this via the `--source` option). Create a folder named `invoice` here:

        mkdir -p ~/.document-templates/invoice

2. Create a `template.yaml` file in this folder to define basic options which will be passed on to [wkhtmltopdf](https://wkhtmltopdf.org/) for .pdf generation:

        touch template.yaml

    *.document-templates/invoice/template.yaml*

    ```
    page-size: A4
    margin-top: 10mm
    margin-right: 10mm
    margin-bottom: 10mm
    margin-left: 20mm
    ```

3. Now create a `template.html` file to define the layout of the document. You can use [Nunjucks](https://mozilla.github.io/nunjucks/) template language to work with variables, inheritance, loops etc.:

        touch template.html

    *.document-templates/invoice/template.html*

    ```
    <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body>
        <header>
          <h1>{{ flavour.title }}</h1>
        </header>
        <main>
          <ul>
            {% for item in items %}
              <li>{{ item.description }} - {{ item.price }}</li>
            {% endfor %}
          </ul>
        </main>
      </body>
    </html>
    ```

4. As you see above, we use variables in our template to render dynamic data. Every document template consists of one or more *flavours*, think of them as a variation of your document. Flavours come in handy if you want to generate your invoices in different languages for example.

    Create a directory named `flavours` in your template folder:

        mkdir flavours
        touch flavours/default.yaml

    Create a flavour file in this folder named `default.yaml`, it will be the standard flavour the generator picks as long as you didn't define another flavour via the `--flavour` option. Since we used already one flavour variable named `title` in the HTML template, we define it here with YAML syntax:

    *.document-templates/invoice/flavours/default.yaml*

        title: Invoice

    Let's create an alternative flavour (just for fun) and name it `de.yaml` to have the option to generate a German invoice:
    
        touch de.yaml

    *.document-templates/invoice/flavours/de.yaml*

        title: Rechnung

5. To style the document we create a `styles` folder in the template folder with a `template.scss` file inside:

        mkdir styles
        touch styles/template.scss

    Use CSS or SCSS sytax now to style your layout. You can also separate your styles into separate files etc., we will only have a single, simple file for now:

    *.document-templates/invoice/styles/template.scss*

    ```
    $blue: #00f;

    h1 {
      color: $blue;
    }
    ```

6. We are done with creating our invoice template! The file structure should be the following now:

    ```
    invoice
    ├── flavours
    │   ├── default.yaml
    │   └── de.yaml
    ├── styles
    │   ├── template.scss
    ├── template.html
    └── template.yaml
    ```

7. Create the actual `my-invoice.yaml` to generate a .pdf file.

        touch ~/my-invoice.yaml

    So far we only declared one variable named `items` in our template, lets fill it with content:

    ```
    items:
        - description: Doing something
          price: 10
        - description: Doing something else
          price: 90
    ```

8. Finally run `document-generator` to make a .pdf! The program uses the `invoice` template by default:

        document-generator my-invoice.yaml

    To generate the German invoice, we would add the `--flavour` option:

        document-generator my-invoice.yaml --flavour de

    To use another template, you could adress it via:

        document-generator a-serious-letter.yaml --flavour official --template letter
