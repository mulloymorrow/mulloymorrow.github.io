<h1 id="welcome-to-stackedit">Welcome to StackEdit!</h1>

<p>Hey! I’m your first Markdown document in <strong>StackEdit</strong><a href="#fn:stackedit" id="fnref:stackedit" title="See footnote" class="footnote">1</a>. Don’t delete me, I’m very helpful! I can be recovered anyway in the <strong>Utils</strong> tab of the <i class="icon-cog"></i> <strong>Settings</strong> dialog.</p>

<hr>



<h2 id="documents">Documents</h2>

<p>StackEdit stores your documents in your browser, which means all your documents are automatically saved locally and are accessible <strong>offline!</strong></p>

<blockquote>
  <p><strong>Note:</strong></p>
  
  <ul>
  <li>StackEdit is accessible offline after the application has been loaded for the first time.</li>
  <li>Your local documents are not shared between different browsers or computers.</li>
  <li>Clearing your browser’s data may <strong>delete all your local documents!</strong> Make sure your documents are synchronized with <strong>Google Drive</strong> or <strong>Dropbox</strong> (check out the <a href="#synchronization"><i class="icon-refresh"></i> Synchronization</a> section).</li>
  </ul>
</blockquote>



<h4 id="create-a-document"><i class="icon-file"></i> Create a document</h4>

<p>The document panel is accessible using the <i class="icon-folder-open"></i> button in the navigation bar. You can create a new document by clicking <i class="icon-file"></i> <strong>New document</strong> in the document panel.</p>



<h4 id="switch-to-another-document"><i class="icon-folder-open"></i> Switch to another document</h4>

<p>All your local documents are listed in the document panel. You can switch from one to another by clicking a document in the list or you can toggle documents using <kbd>Ctrl+[</kbd> and <kbd>Ctrl+]</kbd>.</p>



<h4 id="rename-a-document"><i class="icon-pencil"></i> Rename a document</h4>

<p>You can rename the current document by clicking the document title in the navigation bar.</p>



<h4 id="delete-a-document"><i class="icon-trash"></i> Delete a document</h4>

<p>You can delete the current document by clicking <i class="icon-trash"></i> <strong>Delete document</strong> in the document panel.</p>



<h4 id="export-a-document"><i class="icon-hdd"></i> Export a document</h4>

<p>You can save the current document to a file by clicking <i class="icon-hdd"></i> <strong>Export to disk</strong> from the <i class="icon-provider-stackedit"></i> menu panel.</p>

<blockquote>
  <p><strong>Tip:</strong> Check out the <a href="#publish-a-document"><i class="icon-upload"></i> Publish a document</a> section for a description of the different output formats.</p>
</blockquote>

<hr>



<h2 id="synchronization">Synchronization</h2>

<p>StackEdit can be combined with <i class="icon-provider-gdrive"></i> <strong>Google Drive</strong> and <i class="icon-provider-dropbox"></i> <strong>Dropbox</strong> to have your documents saved in the <em>Cloud</em>. The synchronization mechanism takes care of uploading your modifications or downloading the latest version of your documents.</p>

<blockquote>
  <p><strong>Note:</strong></p>
  
  <ul>
  <li>Full access to <strong>Google Drive</strong> or <strong>Dropbox</strong> is required to be able to import any document in StackEdit. Permission restrictions can be configured in the settings.</li>
  <li>Imported documents are downloaded in your browser and are not transmitted to a server.</li>
  <li>If you experience problems saving your documents on Google Drive, check and optionally disable browser extensions, such as Disconnect.</li>
  </ul>
</blockquote>



<h4 id="open-a-document"><i class="icon-refresh"></i> Open a document</h4>

<p>You can open a document from <i class="icon-provider-gdrive"></i> <strong>Google Drive</strong> or the <i class="icon-provider-dropbox"></i> <strong>Dropbox</strong> by opening the <i class="icon-refresh"></i> <strong>Synchronize</strong> sub-menu and by clicking <strong>Open from…</strong>. Once opened, any modification in your document will be automatically synchronized with the file in your <strong>Google Drive</strong> / <strong>Dropbox</strong> account.</p>



<h4 id="save-a-document"><i class="icon-refresh"></i> Save a document</h4>

<p>You can save any document by opening the <i class="icon-refresh"></i> <strong>Synchronize</strong> sub-menu and by clicking <strong>Save on…</strong>. Even if your document is already synchronized with <strong>Google Drive</strong> or <strong>Dropbox</strong>, you can export it to a another location. StackEdit can synchronize one document with multiple locations and accounts.</p>



<h4 id="synchronize-a-document"><i class="icon-refresh"></i> Synchronize a document</h4>

<p>Once your document is linked to a <i class="icon-provider-gdrive"></i> <strong>Google Drive</strong> or a <i class="icon-provider-dropbox"></i> <strong>Dropbox</strong> file, StackEdit will periodically (every 3 minutes) synchronize it by downloading/uploading any modification. A merge will be performed if necessary and conflicts will be detected.</p>

<p>If you just have modified your document and you want to force the synchronization, click the <i class="icon-refresh"></i> button in the navigation bar.</p>

<blockquote>
  <p><strong>Note:</strong> The <i class="icon-refresh"></i> button is disabled when you have no document to synchronize.</p>
</blockquote>



<h4 id="manage-document-synchronization"><i class="icon-refresh"></i> Manage document synchronization</h4>

<p>Since one document can be synchronized with multiple locations, you can list and manage synchronized locations by clicking <i class="icon-refresh"></i> <strong>Manage synchronization</strong> in the <i class="icon-refresh"></i> <strong>Synchronize</strong> sub-menu. This will let you remove synchronization locations that are associated to your document.</p>

<blockquote>
  <p><strong>Note:</strong> If you delete the file from <strong>Google Drive</strong> or from <strong>Dropbox</strong>, the document will no longer be synchronized with that location.</p>
</blockquote>

<hr>



<h2 id="publication">Publication</h2>

<p>Once you are happy with your document, you can publish it on different websites directly from StackEdit. As for now, StackEdit can publish on <strong>Blogger</strong>, <strong>Dropbox</strong>, <strong>Gist</strong>, <strong>GitHub</strong>, <strong>Google Drive</strong>, <strong>Tumblr</strong>, <strong>WordPress</strong> and on any SSH server.</p>



<h4 id="publish-a-document"><i class="icon-upload"></i> Publish a document</h4>

<p>You can publish your document by opening the <i class="icon-upload"></i> <strong>Publish</strong> sub-menu and by choosing a website. In the dialog box, you can choose the publication format:</p>

<ul>
<li>Markdown, to publish the Markdown text on a website that can interpret it (<strong>GitHub</strong> for instance),</li>
<li>HTML, to publish the document converted into HTML (on a blog for example),</li>
<li>Template, to have a full control of the output.</li>
</ul>

<blockquote>
  <p><strong>Note:</strong> The default template is a simple webpage wrapping your document in HTML format. You can customize it in the <strong>Advanced</strong> tab of the <i class="icon-cog"></i> <strong>Settings</strong> dialog.</p>
</blockquote>



<h4 id="update-a-publication"><i class="icon-upload"></i> Update a publication</h4>

<p>After publishing, StackEdit will keep your document linked to that publication which makes it easy for you to update it. Once you have modified your document and you want to update your publication, click on the <i class="icon-upload"></i> button in the navigation bar.</p>

<blockquote>
  <p><strong>Note:</strong> The <i class="icon-upload"></i> button is disabled when your document has not been published yet.</p>
</blockquote>



<h4 id="manage-document-publication"><i class="icon-upload"></i> Manage document publication</h4>

<p>Since one document can be published on multiple locations, you can list and manage publish locations by clicking <i class="icon-upload"></i> <strong>Manage publication</strong> in the <i class="icon-provider-stackedit"></i> menu panel. This will let you remove publication locations that are associated to your document.</p>

<blockquote>
  <p><strong>Note:</strong> If the file has been removed from the website or the blog, the document will no longer be published on that location.</p>
</blockquote>

<hr>



<h2 id="markdown-extra">Markdown Extra</h2>

<p>StackEdit supports <strong>Markdown Extra</strong>, which extends <strong>Markdown</strong> syntax with some nice features.</p>

<blockquote>
  <p><strong>Tip:</strong> You can disable any <strong>Markdown Extra</strong> feature in the <strong>Extensions</strong> tab of the <i class="icon-cog"></i> <strong>Settings</strong> dialog.</p>
  
  <p><strong>Note:</strong> You can find more information about <strong>Markdown</strong> syntax <a href="http://daringfireball.net/projects/markdown/syntax" title="Markdown">here</a> and <strong>Markdown Extra</strong> extension <a href="https://github.com/jmcmanus/pagedown-extra" title="Pagedown Extra">here</a>.</p>
</blockquote>



<h3 id="tables">Tables</h3>

<p><strong>Markdown Extra</strong> has a special syntax for tables:</p>

<table>
<thead>
<tr>
  <th>Item</th>
  <th>Value</th>
</tr>
</thead>
<tbody><tr>
  <td>Computer</td>
  <td>$1600</td>
</tr>
<tr>
  <td>Phone</td>
  <td>$12</td>
</tr>
<tr>
  <td>Pipe</td>
  <td>$1</td>
</tr>
</tbody></table>


<p>You can specify column alignment with one or two colons:</p>

<table>
<thead>
<tr>
  <th align="left">Item</th>
  <th align="right">Value</th>
  <th align="center">Qty</th>
</tr>
</thead>
<tbody><tr>
  <td align="left">Computer</td>
  <td align="right">$1600</td>
  <td align="center">5</td>
</tr>
<tr>
  <td align="left">Phone</td>
  <td align="right">$12</td>
  <td align="center">12</td>
</tr>
<tr>
  <td align="left">Pipe</td>
  <td align="right">$1</td>
  <td align="center">234</td>
</tr>
</tbody></table>




<h3 id="definition-lists">Definition Lists</h3>

<p><strong>Markdown Extra</strong> has a special syntax for definition lists too:</p>

<dl>
<dt>Term 1</dt>
<dt>Term 2</dt>
<dd>Definition A</dd>

<dd>Definition B</dd>

<dt>Term 3</dt>
<dd>
<p>Definition C</p>
</dd>

<dd>
<p>Definition D</p>

<blockquote>
  <p>part of definition D</p>
</blockquote>
</dd>
</dl>



<h3 id="fenced-code-blocks">Fenced code blocks</h3>

<p>GitHub’s fenced code blocks are also supported with <strong>Highlight.js</strong> syntax highlighting:</p>



<pre class="prettyprint"><code class=" hljs cs"><span class="hljs-comment">// Foo</span>
<span class="hljs-keyword">var</span> bar = <span class="hljs-number">0</span>;</code></pre>

<blockquote>
  <p><strong>Tip:</strong> To use <strong>Prettify</strong> instead of <strong>Highlight.js</strong>, just configure the <strong>Markdown Extra</strong> extension in the <i class="icon-cog"></i> <strong>Settings</strong> dialog.</p>
  
  <p><strong>Note:</strong> You can find more information:</p>
  
  <ul>
  <li>about <strong>Prettify</strong> syntax highlighting <a href="https://code.google.com/p/google-code-prettify/">here</a>,</li>
  <li>about <strong>Highlight.js</strong> syntax highlighting <a href="http://highlightjs.org/">here</a>.</li>
  </ul>
</blockquote>



<h3 id="footnotes">Footnotes</h3>

<p>You can create footnotes like this<a href="#fn:footnote" id="fnref:footnote" title="See footnote" class="footnote">2</a>.</p>



<h3 id="smartypants">SmartyPants</h3>

<p>SmartyPants converts ASCII punctuation characters into “smart” typographic punctuation HTML entities. For example:</p>

<table>
<thead>
<tr>
  <th></th>
  <th>ASCII</th>
  <th>HTML</th>
</tr>
</thead>
<tbody><tr>
  <td>Single backticks</td>
  <td><code>'Isn't this fun?'</code></td>
  <td>‘Isn’t this fun?’</td>
</tr>
<tr>
  <td>Quotes</td>
  <td><code>"Isn't this fun?"</code></td>
  <td>“Isn’t this fun?”</td>
</tr>
<tr>
  <td>Dashes</td>
  <td><code>-- is en-dash, --- is em-dash</code></td>
  <td>– is en-dash, — is em-dash</td>
</tr>
</tbody></table>




<h3 id="table-of-contents">Table of contents</h3>

<p>You can insert a table of contents using the marker <code>[TOC]</code>:</p>

<p><div class="toc">
<ul>
<li><a href="#welcome-to-stackedit">Welcome to StackEdit!</a><ul>
<li><a href="#documents">Documents</a><ul>
<li><ul>
<li><a href="#create-a-document"> Create a document</a></li>
<li><a href="#switch-to-another-document"> Switch to another document</a></li>
<li><a href="#rename-a-document"> Rename a document</a></li>
<li><a href="#delete-a-document"> Delete a document</a></li>
<li><a href="#export-a-document"> Export a document</a></li>
</ul>
</li>
</ul>
</li>
<li><a href="#synchronization">Synchronization</a><ul>
<li><ul>
<li><a href="#open-a-document"> Open a document</a></li>
<li><a href="#save-a-document"> Save a document</a></li>
<li><a href="#synchronize-a-document"> Synchronize a document</a></li>
<li><a href="#manage-document-synchronization"> Manage document synchronization</a></li>
</ul>
</li>
</ul>
</li>
<li><a href="#publication">Publication</a><ul>
<li><ul>
<li><a href="#publish-a-document"> Publish a document</a></li>
<li><a href="#update-a-publication"> Update a publication</a></li>
<li><a href="#manage-document-publication"> Manage document publication</a></li>
</ul>
</li>
</ul>
</li>
<li><a href="#markdown-extra">Markdown Extra</a><ul>
<li><a href="#tables">Tables</a></li>
<li><a href="#definition-lists">Definition Lists</a></li>
<li><a href="#fenced-code-blocks">Fenced code blocks</a></li>
<li><a href="#footnotes">Footnotes</a></li>
<li><a href="#smartypants">SmartyPants</a></li>
<li><a href="#table-of-contents">Table of contents</a></li>
<li><a href="#mathjax">MathJax</a></li>
<li><a href="#uml-diagrams">UML diagrams</a></li>
<li><a href="#support-stackedit">Support StackEdit</a></li>
</ul>
</li>
</ul>
</li>
</ul>
</div>
</p>



<h3 id="mathjax">MathJax</h3>

<p>You can render <em>LaTeX</em> mathematical expressions using <strong>MathJax</strong>, as on <a href="http://math.stackexchange.com/">math.stackexchange.com</a>:</p>

<p>The <em>Gamma function</em> satisfying <script type="math/tex" id="MathJax-Element-1">\Gamma(n) = (n-1)!\quad\forall n\in\mathbb N</script> is via the Euler integral</p>



<p><script type="math/tex; mode=display" id="MathJax-Element-2">
\Gamma(z) = \int_0^\infty t^{z-1}e^{-t}dt\,.
</script></p>

<blockquote>
  <p><strong>Tip:</strong> To make sure mathematical expressions are rendered properly on your website, include <strong>MathJax</strong> into your template:</p>
</blockquote>



<pre class="prettyprint"><code class=" hljs xml"><span class="hljs-tag">&lt;<span class="hljs-title">script</span> <span class="hljs-attribute">type</span>=<span class="hljs-value">"text/javascript"</span> <span class="hljs-attribute">src</span>=<span class="hljs-value">"https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML"</span>&gt;</span><span class="javascript"></span><span class="hljs-tag">&lt;/<span class="hljs-title">script</span>&gt;</span></code></pre>

<blockquote>
  <p><strong>Note:</strong> You can find more information about <strong>LaTeX</strong> mathematical expressions <a href="http://meta.math.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference">here</a>.</p>
</blockquote>



<h3 id="uml-diagrams">UML diagrams</h3>

<p>You can also render sequence diagrams like this:</p>



<div class="sequence-diagram"><svg height="257.5" version="1.1" width="393.046875" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="overflow: hidden; position: relative; left: -0.5px; top: -0.734375px;"><desc style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);">Created with Raphaël 2.1.2</desc><defs style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"><path stroke-linecap="round" d="M5,0 0,2.5 5,5z" id="raphael-marker-block" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></path><marker id="raphael-marker-endblock55-obj21" markerHeight="5" markerWidth="5" orient="auto" refX="2.5" refY="2.5" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#raphael-marker-block" transform="rotate(180 2.5 2.5) scale(1,1)" stroke-width="1.0000" fill="#000" stroke="none" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></use></marker><marker id="raphael-marker-endblock55-obj27" markerHeight="5" markerWidth="5" orient="auto" refX="2.5" refY="2.5" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#raphael-marker-block" transform="rotate(180 2.5 2.5) scale(1,1)" stroke-width="1.0000" fill="#000" stroke="none" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></use></marker></defs><rect x="10" y="20" width="52.5" height="37.5" rx="0" ry="0" fill="none" stroke="#000000" stroke-width="2" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></rect><rect x="19.984375" y="30" width="32.5" height="17.5" rx="0" ry="0" fill="#ffffff" stroke="none" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></rect><text x="36.25" y="38.75" text-anchor="middle" font-family="Andale Mono, monospace" font-size="16px" stroke="none" fill="#000000" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); text-anchor: middle; font-family: 'Andale Mono', monospace; font-size: 16px;"><tspan dy="5.25" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);">Alice</tspan></text><rect x="10" y="200" width="52.5" height="37.5" rx="0" ry="0" fill="none" stroke="#000000" stroke-width="2" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></rect><rect x="19.984375" y="210" width="32.5" height="17.5" rx="0" ry="0" fill="#ffffff" stroke="none" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></rect><text x="36.25" y="218.75" text-anchor="middle" font-family="Andale Mono, monospace" font-size="16px" stroke="none" fill="#000000" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); text-anchor: middle; font-family: 'Andale Mono', monospace; font-size: 16px;"><tspan dy="5.25" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);">Alice</tspan></text><path fill="none" stroke="#000000" d="M36.25,57.5L36.25,200" stroke-width="2" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></path><rect x="196.328125" y="20" width="46.6875" height="37.5" rx="0" ry="0" fill="none" stroke="#000000" stroke-width="2" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></rect><rect x="206.3125" y="30" width="26.6875" height="17.5" rx="0" ry="0" fill="#ffffff" stroke="none" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></rect><text x="219.671875" y="38.75" text-anchor="middle" font-family="Andale Mono, monospace" font-size="16px" stroke="none" fill="#000000" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); text-anchor: middle; font-family: 'Andale Mono', monospace; font-size: 16px;"><tspan dy="5.25" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);">Bob</tspan></text><rect x="196.328125" y="200" width="46.6875" height="37.5" rx="0" ry="0" fill="none" stroke="#000000" stroke-width="2" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></rect><rect x="206.3125" y="210" width="26.6875" height="17.5" rx="0" ry="0" fill="#ffffff" stroke="none" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></rect><text x="219.671875" y="218.75" text-anchor="middle" font-family="Andale Mono, monospace" font-size="16px" stroke="none" fill="#000000" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); text-anchor: middle; font-family: 'Andale Mono', monospace; font-size: 16px;"><tspan dy="5.25" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);">Bob</tspan></text><path fill="none" stroke="#000000" d="M219.671875,57.5L219.671875,200" stroke-width="2" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></path><rect x="46.234375" y="73.75" width="163.421875" height="17.5" rx="0" ry="0" fill="#ffffff" stroke="none" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></rect><text x="127.9609375" y="82.5" text-anchor="middle" font-family="Andale Mono, monospace" font-size="16px" stroke="none" fill="#000000" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); text-anchor: middle; font-family: 'Andale Mono', monospace; font-size: 16px;"><tspan dy="5.25" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);">Hello Bob, how are you?</tspan></text><path fill="none" stroke="#000000" d="M36.25,95C36.25,95,185.27345137298107,95,214.6706556477293,95" stroke-width="2" marker-end="url(#raphael-marker-endblock55-obj21)" stroke-dasharray="0" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></path><rect x="239.671875" y="115" width="80.03125" height="27.5" rx="0" ry="0" fill="none" stroke="#000000" stroke-width="2" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></rect><rect x="244.65625" y="120" width="70.03125" height="17.5" rx="0" ry="0" fill="#ffffff" stroke="none" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></rect><text x="279.6875" y="128.75" text-anchor="middle" font-family="Andale Mono, monospace" font-size="16px" stroke="none" fill="#000000" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); text-anchor: middle; font-family: 'Andale Mono', monospace; font-size: 16px;"><tspan dy="5.25" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);">Bob thinks</tspan></text><rect x="68.328125" y="158.75" width="119.234375" height="17.5" rx="0" ry="0" fill="#ffffff" stroke="none" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></rect><text x="127.9609375" y="167.5" text-anchor="middle" font-family="Andale Mono, monospace" font-size="16px" stroke="none" fill="#000000" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); text-anchor: middle; font-family: 'Andale Mono', monospace; font-size: 16px;"><tspan dy="5.25" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);">I am good thanks!</tspan></text><path fill="none" stroke="#000000" d="M219.671875,180C219.671875,180,70.64842362701893,180,41.25121935227071,180" stroke-width="2" marker-end="url(#raphael-marker-endblock55-obj27)" stroke-dasharray="6,2" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></path></svg></div>

<p>And flow charts like this:</p>



<div class="flow-chart"><svg height="418.60546875" version="1.1" width="186.484375" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="overflow: hidden; position: relative; top: -0.328125px;"><desc style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);">Created with Raphaël 2.1.2</desc><defs style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"><marker id="raphael-marker-endblock33-obj36" markerHeight="3" markerWidth="3" orient="auto" refX="1.5" refY="1.5" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#raphael-marker-block" transform="rotate(180 1.5 1.5) scale(0.6,0.6)" stroke-width="1.6667" fill="black" stroke="none" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></use></marker><marker id="raphael-marker-endblock33-obj37" markerHeight="3" markerWidth="3" orient="auto" refX="1.5" refY="1.5" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#raphael-marker-block" transform="rotate(180 1.5 1.5) scale(0.6,0.6)" stroke-width="1.6667" fill="black" stroke="none" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></use></marker><marker id="raphael-marker-endblock33-obj38" markerHeight="3" markerWidth="3" orient="auto" refX="1.5" refY="1.5" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#raphael-marker-block" transform="rotate(180 1.5 1.5) scale(0.6,0.6)" stroke-width="1.6667" fill="black" stroke="none" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></use></marker><marker id="raphael-marker-endblock33-obj40" markerHeight="3" markerWidth="3" orient="auto" refX="1.5" refY="1.5" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#raphael-marker-block" transform="rotate(180 1.5 1.5) scale(0.6,0.6)" stroke-width="1.6667" fill="black" stroke="none" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></use></marker></defs><rect x="0" y="0" width="51.671875" height="37.5" rx="20" ry="20" fill="#ffffff" stroke="#000000" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);" stroke-width="2" class="flowchart" id="st" transform="matrix(1,0,0,1,55.9063,24.1211)"></rect><text x="10" y="18.75" text-anchor="start" font-family="sans-serif" font-size="14px" stroke="none" fill="#000000" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); text-anchor: start; font-family: sans-serif; font-size: 14px; font-weight: normal;" id="stt" class="flowchartt" font-weight="normal" transform="matrix(1,0,0,1,55.9063,24.1211)"><tspan dy="5.25" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);">Start</tspan></text><rect x="0" y="0" width="110.03125" height="37.5" rx="0" ry="0" fill="#ffffff" stroke="#000000" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);" stroke-width="2" class="flowchart" id="op" transform="matrix(1,0,0,1,26.7266,135.7422)"></rect><text x="10" y="18.75" text-anchor="start" font-family="sans-serif" font-size="14px" stroke="none" fill="#000000" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); text-anchor: start; font-family: sans-serif; font-size: 14px; font-weight: normal;" id="opt" class="flowchartt" font-weight="normal" transform="matrix(1,0,0,1,26.7266,135.7422)"><tspan dy="5.25" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);">My Operation</tspan></text><path fill="#ffffff" stroke="#000000" d="M38.87109375,19.435546875L0,38.87109375L77.7421875,77.7421875L155.484375,38.87109375L77.7421875,0L0,38.87109375" stroke-width="2" font-family="sans-serif" font-weight="normal" id="cond" class="flowchart" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); font-family: sans-serif; font-weight: normal;" transform="matrix(1,0,0,1,4,227.2422)"></path><text x="43.87109375" y="38.87109375" text-anchor="start" font-family="sans-serif" font-size="14px" stroke="none" fill="#000000" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); text-anchor: start; font-family: sans-serif; font-size: 14px; font-weight: normal;" id="condt" class="flowchartt" font-weight="normal" transform="matrix(1,0,0,1,4,227.2422)"><tspan dy="5.26171875" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);">Yes or No?</tspan><tspan dy="18" x="43.87109375" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></tspan></text><rect x="0" y="0" width="46.6875" height="37.5" rx="20" ry="20" fill="#ffffff" stroke="#000000" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);" stroke-width="2" class="flowchart" id="e" transform="matrix(1,0,0,1,58.3984,379.1055)"></rect><text x="10" y="18.75" text-anchor="start" font-family="sans-serif" font-size="14px" stroke="none" fill="#000000" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); text-anchor: start; font-family: sans-serif; font-size: 14px; font-weight: normal;" id="et" class="flowchartt" font-weight="normal" transform="matrix(1,0,0,1,58.3984,379.1055)"><tspan dy="5.25" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);">End</tspan></text><path fill="none" stroke="#000000" d="M81.7421875,61.62109375C81.7421875,61.62109375,81.7421875,118.877874314785,81.7421875,132.74475085781887" stroke-width="2" marker-end="url(#raphael-marker-endblock33-obj36)" font-family="sans-serif" font-weight="normal" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); font-family: sans-serif; font-weight: normal;"></path><path fill="none" stroke="#000000" d="M81.7421875,173.2421875C81.7421875,173.2421875,81.7421875,212.89628744125366,81.7421875,224.24262658460066" stroke-width="2" marker-end="url(#raphael-marker-endblock33-obj37)" font-family="sans-serif" font-weight="normal" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); font-family: sans-serif; font-weight: normal;"></path><path fill="none" stroke="#000000" d="M81.7421875,304.984375C81.7421875,304.984375,81.7421875,362.241155564785,81.7421875,376.1080321078189" stroke-width="2" marker-end="url(#raphael-marker-endblock33-obj38)" font-family="sans-serif" font-weight="normal" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); font-family: sans-serif; font-weight: normal;"></path><text x="86.7421875" y="314.984375" text-anchor="start" font-family="sans-serif" font-size="14px" stroke="none" fill="#000000" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); text-anchor: start; font-family: sans-serif; font-size: 14px; font-weight: normal;" font-weight="normal"><tspan dy="5.25" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);">yes</tspan></text><path fill="none" stroke="#000000" d="M159.484375,266.11328125C159.484375,266.11328125,184.484375,266.11328125,184.484375,266.11328125C184.484375,266.11328125,184.484375,110.7421875,184.484375,110.7421875C184.484375,110.7421875,81.7421875,110.7421875,81.7421875,110.7421875C81.7421875,110.7421875,81.7421875,126.11563205718994,81.7421875,132.75143527425826" stroke-width="2" marker-end="url(#raphael-marker-endblock33-obj40)" font-family="sans-serif" font-weight="normal" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); font-family: sans-serif; font-weight: normal;"></path><text x="164.484375" y="256.11328125" text-anchor="start" font-family="sans-serif" font-size="14px" stroke="none" fill="#000000" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0); text-anchor: start; font-family: sans-serif; font-size: 14px; font-weight: normal;" font-weight="normal"><tspan dy="5.25390625" style="-webkit-tap-highlight-color: rgba(0, 0, 0, 0);">no</tspan></text></svg></div>

<blockquote>
  <p><strong>Note:</strong> You can find more information:</p>
  
  <ul>
  <li>about <strong>Sequence diagrams</strong> syntax <a href="http://bramp.github.io/js-sequence-diagrams/">here</a>,</li>
  <li>about <strong>Flow charts</strong> syntax <a href="http://adrai.github.io/flowchart.js/">here</a>.</li>
  </ul>
</blockquote>



<h3 id="support-stackedit">Support StackEdit</h3>

<p><a href="https://monetizejs.com/authorize?client_id=ESTHdCYOi18iLhhO&amp;summary=true"><img src="https://cdn.monetizejs.com/resources/button-32.png" alt="" title=""></a></p>

<div class="footnotes"><hr><ol><li id="fn:stackedit"><a href="https://stackedit.io/">StackEdit</a> is a full-featured, open-source Markdown editor based on PageDown, the Markdown library used by Stack Overflow and the other Stack Exchange sites. <a href="#fnref:stackedit" title="Return to article" class="reversefootnote">↩</a></li><li id="fn:footnote">Here is the <em>text</em> of the <strong>footnote</strong>. <a href="#fnref:footnote" title="Return to article" class="reversefootnote">↩</a></li></ol></div>