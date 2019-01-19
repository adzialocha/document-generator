# document-generator

Generate your .pdf invoices, letters, documents, etc. with templates based on [YAML](https://yaml.org/), [HTML](https://dev.w3.org/html5/html-author/) & [SCSS](https://sass-lang.com).

## Features

* Separates the document content from its form
* Templates and contents are in plain text form and can easily be combined with version control systems
* Defines the actual content in simple YAML syntax
* Defines documents via HTML and SCSS (with all of its features like variables, import statements, etc.)
* Offers filters, inheritance, loops etc. in HTML templates via [Nunjucks](https://mozilla.github.io/nunjucks/)
* Multiple templates
* Organizes *flavours* for document variants (for example different languages)
* Generates .pdf files via [wkhtmltopdf](https://wkhtmltopdf.org/)

## Install

It is recommended to install `document-generator` globally via `npm`:

    `npm install -g document-generator`

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

1. By default `document-generator` looks into `~/.document-templates/` for your defined templates (you can change this via the `--source` option). Create a folder named `invoice` here:

    `mkdir -p ~/.document-templates/invoice`

2. Create a `template.yaml` file in this folder to define basic options which will be passed on to [wkhtmltopdf](https://wkhtmltopdf.org/) for .pdf generation:

    *.document-templates/invoice/template.yaml*

    ```
    page-size: A4
    margin-top: 10mm
    margin-right: 10mm
    margin-bottom: 10mm
    margin-left: 20mm
    ```

3. Now create a `template.html` file to define the layout of the document. You can use [Nunjucks](https://mozilla.github.io/nunjucks/) template language to work with variables, inheritance, loops etc.:

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

4. As you can see above, we are using variables in our template to render dynamic data. Every document template can consist of one or more so called *flavours*, think of them as a variation of your documents. Flavours come in handy if you want to for example generate your invoices sometimes in English or in Japanese.

Create a folder named `flavours` in your document template first to use them:

    `mkdir flavours`

Create a flavour file in this folder named `default.yaml`, it will be the standard flavour the generator will pick as long as you didn't define another flavour via the `--flavour` option. Since we used already one flavour variable named `title` in the HTML template, we define it here with YAML syntax:

    *.document-templates/invoice/flavours/default.yaml*

    `title: Invoice`

Let's create an alternative flavour just for fun and name it `de.yaml` to have the option to generate a German invoice:

    *.document-templates/invoice/flavours/de.yaml*

    `title: Rechnung`

5. We want to style our document now and therefore create a `styles` folder in the template with a `templates.scss` file inside:

    `mkdir styles`

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
    │   └── en.yaml
    ├── styles
    │   ├── template.scss
    ├── template.html
    └── template.yaml
    ```

7. Create the actual `my-invoice.yaml` now to generate.

  ```
  touch ~/my-invoice.yaml
  ```

So far we only declared one variable named `items` in our template. We can use this now to fill in the fields:

  ```
  items:
    - description: Doing something
      price: 10
    - description: Doing something else
      price: 100
  ```

8. Finally let's start `document-generator` to make a .pdf! The program uses the invoice template by default, so no need to declare it:

  ```
  document-generator my-invoice.yaml
  ```

To generate the German invoice, we would add the `--flavour` option:

  ```
  document-generator my-invoice.yaml --flavour de
  ```

Imagine you would also work with a `letter` template, you could generate one via:

  ```
  document-generator a-serious-letter.yaml --flavour official --template letter
  ```
